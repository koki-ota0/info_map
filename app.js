// InfoMap - ニュース情報空間可視化アプリケーション

class InfoMap {
    constructor() {
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.xScale = null;
        this.yScale = null;
        this.currentArticle = null;
        this.readArticles = new Set();
        this.tooltip = document.getElementById('tooltip');

        this.init();
    }

    init() {
        this.setupSVG();
        this.setupScales();
        this.renderLegend();
        this.renderArticles();
        this.setupZoom();
        this.updateDiversityScore();
    }

    setupSVG() {
        const container = document.getElementById('map');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg = d3.select('#map')
            .attr('width', this.width)
            .attr('height', this.height);

        // メインのグループ（ズーム用）
        this.mainGroup = this.svg.append('g')
            .attr('class', 'main-group');

        // グリッド線
        this.renderGrid();
    }

    renderGrid() {
        const gridGroup = this.mainGroup.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1);

        // 縦線
        for (let i = 0; i <= 10; i++) {
            gridGroup.append('line')
                .attr('x1', this.margin.left + (this.width - this.margin.left - this.margin.right) * i / 10)
                .attr('y1', this.margin.top)
                .attr('x2', this.margin.left + (this.width - this.margin.left - this.margin.right) * i / 10)
                .attr('y2', this.height - this.margin.bottom)
                .attr('stroke', '#444');
        }

        // 横線
        for (let i = 0; i <= 10; i++) {
            gridGroup.append('line')
                .attr('x1', this.margin.left)
                .attr('y1', this.margin.top + (this.height - this.margin.top - this.margin.bottom) * i / 10)
                .attr('x2', this.width - this.margin.right)
                .attr('y2', this.margin.top + (this.height - this.margin.top - this.margin.bottom) * i / 10)
                .attr('stroke', '#444');
        }
    }

    setupScales() {
        this.xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([this.margin.left, this.width - this.margin.right]);

        this.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([this.margin.top, this.height - this.margin.bottom]);
    }

    setupZoom() {
        const zoom = d3.zoom()
            .scaleExtent([0.5, 5])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            });

        this.svg.call(zoom);
    }

    renderLegend() {
        const legend = document.getElementById('legend');
        legend.innerHTML = '';

        Object.entries(TOPICS).forEach(([key, topic]) => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <span class="legend-color" style="background: ${topic.color}"></span>
                <span>${topic.label}</span>
            `;
            item.onclick = () => this.highlightTopic(key);
            legend.appendChild(item);
        });
    }

    renderArticles() {
        const articlesGroup = this.mainGroup.append('g')
            .attr('class', 'articles');

        // 接続線（同じトピック内）
        this.renderConnections(articlesGroup);

        // 記事ノード
        const nodes = articlesGroup.selectAll('.article-node')
            .data(ARTICLES)
            .enter()
            .append('circle')
            .attr('class', 'article-node')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r', 10)
            .attr('fill', d => TOPICS[d.topic].color)
            .attr('opacity', 0.8)
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mousemove', (event) => this.moveTooltip(event))
            .on('mouseout', () => this.hideTooltip())
            .on('click', (event, d) => this.selectArticle(d));

        // アニメーション
        nodes.attr('r', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 30)
            .attr('r', 10);
    }

    renderConnections(group) {
        const connectionGroup = group.append('g')
            .attr('class', 'connections')
            .attr('opacity', 0.15);

        // 同じトピック内の記事を接続
        Object.keys(TOPICS).forEach(topic => {
            const topicArticles = ARTICLES.filter(a => a.topic === topic);

            for (let i = 0; i < topicArticles.length; i++) {
                for (let j = i + 1; j < topicArticles.length; j++) {
                    const a1 = topicArticles[i];
                    const a2 = topicArticles[j];
                    const distance = Math.sqrt(
                        Math.pow(a1.x - a2.x, 2) + Math.pow(a1.y - a2.y, 2)
                    );

                    if (distance < 0.15) {
                        connectionGroup.append('line')
                            .attr('x1', this.xScale(a1.x))
                            .attr('y1', this.yScale(a1.y))
                            .attr('x2', this.xScale(a2.x))
                            .attr('y2', this.yScale(a2.y))
                            .attr('stroke', TOPICS[topic].color)
                            .attr('stroke-width', 1);
                    }
                }
            }
        });
    }

    showTooltip(event, article) {
        const topic = TOPICS[article.topic];

        this.tooltip.innerHTML = `
            <span class="topic" style="background: ${topic.color}">${topic.label}</span>
            <div class="title">${article.title}</div>
            <div class="source">${article.source}</div>
        `;

        this.tooltip.classList.add('visible');
        this.moveTooltip(event);
    }

    moveTooltip(event) {
        const x = event.clientX + 15;
        const y = event.clientY + 15;

        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    selectArticle(article) {
        // 既読に追加
        this.readArticles.add(article.id);
        this.currentArticle = article;

        // ノードのスタイル更新
        this.svg.selectAll('.article-node')
            .classed('read', d => this.readArticles.has(d.id))
            .classed('current', d => d.id === article.id);

        // サイドバー更新
        this.updateCurrentArticle(article);
        this.updateRecommendations(article);
        this.updateHistory(article);
        this.updateDiversityScore();
    }

    updateCurrentArticle(article) {
        const container = document.getElementById('current-article');
        const topic = TOPICS[article.topic];

        container.innerHTML = `
            <h3>現在の記事</h3>
            <div class="article-detail">
                <span class="topic-badge" style="background: ${topic.color}">${topic.label}</span>
                <div class="title">${article.title}</div>
                <div class="source">${article.source}</div>
            </div>
        `;
    }

    updateRecommendations(article) {
        const list = document.getElementById('recommendation-list');

        // 異なるトピックの記事を推薦
        const recommendations = this.getRecommendations(article, 4);

        list.innerHTML = recommendations.map(rec => {
            const topic = TOPICS[rec.article.topic];
            return `
                <li onclick="infoMap.selectArticle(ARTICLES.find(a => a.id === ${rec.article.id}))"
                    style="border-left-color: ${topic.color}">
                    <span class="topic-badge" style="background: ${topic.color}">${topic.label}</span>
                    <div class="title">${rec.article.title}</div>
                    <div class="reason">${rec.reason}</div>
                </li>
            `;
        }).join('');
    }

    getRecommendations(currentArticle, count) {
        const recommendations = [];

        // 未読トピックを優先
        const readTopics = new Set(
            Array.from(this.readArticles).map(id =>
                ARTICLES.find(a => a.id === id)?.topic
            )
        );

        const unreadTopics = Object.keys(TOPICS).filter(t => !readTopics.has(t));

        // 異なるトピックから推薦
        const otherTopicArticles = ARTICLES.filter(a =>
            a.topic !== currentArticle.topic && !this.readArticles.has(a.id)
        );

        // 未読トピックからの記事を優先
        otherTopicArticles.sort((a, b) => {
            const aUnread = unreadTopics.includes(a.topic) ? 0 : 1;
            const bUnread = unreadTopics.includes(b.topic) ? 0 : 1;
            return aUnread - bUnread;
        });

        otherTopicArticles.slice(0, count).forEach(article => {
            let reason = '';
            if (unreadTopics.includes(article.topic)) {
                reason = '未閲覧のトピックです';
            } else {
                reason = '異なる視点の記事です';
            }
            recommendations.push({ article, reason });
        });

        return recommendations;
    }

    updateHistory(article) {
        const list = document.getElementById('history-list');
        const topic = TOPICS[article.topic];

        const item = document.createElement('li');
        item.style.borderColor = topic.color;
        item.textContent = article.title;

        list.insertBefore(item, list.firstChild);

        // 最大10件
        while (list.children.length > 10) {
            list.removeChild(list.lastChild);
        }
    }

    updateDiversityScore() {
        const scoreElement = document.getElementById('diversity-score');

        if (this.readArticles.size === 0) {
            scoreElement.textContent = '--';
            return;
        }

        // 閲覧トピックの多様性を計算（シャノンエントロピー）
        const topicCounts = {};
        this.readArticles.forEach(id => {
            const article = ARTICLES.find(a => a.id === id);
            if (article) {
                topicCounts[article.topic] = (topicCounts[article.topic] || 0) + 1;
            }
        });

        const total = this.readArticles.size;
        let entropy = 0;
        Object.values(topicCounts).forEach(count => {
            const p = count / total;
            if (p > 0) {
                entropy -= p * Math.log2(p);
            }
        });

        // 最大エントロピー（全トピックが均等）で正規化
        const maxEntropy = Math.log2(Object.keys(TOPICS).length);
        const normalizedScore = entropy / maxEntropy;

        // 0-100のスコアに変換
        const score = Math.round(normalizedScore * 100);
        scoreElement.textContent = score;
    }

    highlightTopic(topic) {
        // トピックをハイライト
        this.svg.selectAll('.article-node')
            .transition()
            .duration(300)
            .attr('opacity', d => d.topic === topic ? 1 : 0.2)
            .attr('r', d => d.topic === topic ? 14 : 8);

        // 2秒後にリセット
        setTimeout(() => {
            this.svg.selectAll('.article-node')
                .transition()
                .duration(300)
                .attr('opacity', 0.8)
                .attr('r', 10);
        }, 2000);
    }
}

// アプリケーション初期化
let infoMap;
document.addEventListener('DOMContentLoaded', () => {
    infoMap = new InfoMap();
});

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    if (infoMap) {
        // リサイズ時に再描画
        document.getElementById('map').innerHTML = '';
        infoMap = new InfoMap();
    }
});
