class LotteryApp {
    constructor() {
        this.participants = [];
        this.isRunning = false;
        this.currentInterval = null;
        this.speed = 100;
        this.history = [];
        this.participantsList = {};
        
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        // 获取DOM元素
    
        this.lotteryBtn = document.getElementById('lotteryBtn');
    
        this.speedRange = document.getElementById('speedRange');
        this.speedValue = document.getElementById('speedValue');
        this.currentName = document.getElementById('currentName');
        this.lotteryWheel = document.getElementById('lotteryWheel');
        this.winnerDisplay = document.getElementById('winnerDisplay');
    
        this.confettiContainer = document.getElementById('confetti-container');
    }

    bindEvents() {
        // 绑定事件监听器
        this.lotteryBtn.addEventListener('click', () => this.toggleLottery());     

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleLottery();
            }
        });
    }

    updateParticipants() {
        // 更新抽奖按钮状态
        if (!this.isRunning) {
            this.lotteryBtn.disabled = this.participants.length === 0;
        }
    }

    toggleLottery() {
        if (this.isRunning) {
            this.stopLottery();
        } else {
            this.startLottery();
        }
    }

    startLottery() {
        this.participants = [
            {text: '喝！', value: 1}, 
            {text: '必须喝！', value: 1}, 
            {text: '肯定喝啊！', value: 1}, 
            {text: '要不小喝一个？', value: 1},
            {text: '今天戒酒！', value: 0}, 
            {text: '喝不了一点！', value: 0}, 
            {text: '不喝！', value: 0}, 
            {text: '真喝不了！', value: 0}
        ];
        this.updateParticipants();

        this.isRunning = true;
        this.lotteryBtn.textContent = '开！';
        this.lotteryBtn.className = 'btn btn-danger';
        this.lotteryWheel.classList.add('spinning');

        // 开始滚动显示名字
        this.currentInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.participants.length);
            this.currentName.textContent = this.participants[randomIndex].text;
        }, this.speed);
    }

    stopLottery() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.lotteryBtn.textContent = '喝不喝？';
        this.lotteryBtn.className = 'btn btn-primary';
        this.lotteryWheel.classList.remove('spinning');

        // 清除定时器
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }

        // 最终选择一个获奖者
        const winnerIndex = Math.floor(Math.random() * this.participants.length);
        const winner = this.participants[winnerIndex].text;
        const isDrink = this.participants[winnerIndex].value;
        
        // 显示获奖者
        this.currentName.textContent = winner;
        
        // 播放庆祝动画
        this.celebrateWinner(isDrink);
    }

    celebrateWinner(isDrink) {

        // 创建彩带效果
        if(isDrink===1){
            this.createConfetti();
        }
        
        // 创建🍻动画
        this.createBeerAnimation(isDrink);
        
        
    }

    createBeerAnimation(isDrink) {
        
        // 创建中心大🍻动画
        const centerBeer = document.createElement('div');
        centerBeer.className = 'beer-animation';
        if(isDrink===1){
            centerBeer.textContent = '🍻';
        }else{
            centerBeer.textContent = '🫵';
        }
        centerBeer.style.left = '50%';
        centerBeer.style.top = '50%';
        centerBeer.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(centerBeer);
        
        // 2秒后移除中心🍻
        setTimeout(() => {
            if (centerBeer.parentNode) {
                centerBeer.parentNode.removeChild(centerBeer);
            }
        }, 2000);
        
        // 创建多个飘浮的🍻
        if(isDrink===1){
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const floatBeer = document.createElement('div');
                    floatBeer.className = 'beer-float';
                    floatBeer.textContent = '🍻';
                    floatBeer.style.left = Math.random() * 100 + 'vw';
                    floatBeer.style.top = '100vh';
                    floatBeer.style.animationDelay = Math.random() * 1 + 's';
                    
                    document.body.appendChild(floatBeer);
                    
                    // 3秒后移除飘浮🍻
                    setTimeout(() => {
                        if (floatBeer.parentNode) {
                            floatBeer.parentNode.removeChild(floatBeer);
                        }
                    }, 3000);
                }, i * 200);
            }
        }
    }

    createConfetti() {
        const colors = ['#f093fb', '#667eea', '#48bb78', '#f5576c', '#764ba2'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                
                this.confettiContainer.appendChild(confetti);
                
                // 3秒后移除彩带
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }

    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#f5576c' : '#48bb78'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageElement);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageElement.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }
}

// 添加消息动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new LotteryApp();
});

// 添加页面可见性API支持，当页面不可见时暂停动画
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面不可见时可以暂停一些动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面可见时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});
