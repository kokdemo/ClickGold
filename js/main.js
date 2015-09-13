/*
 * 一共有三种对象，单位（名称，数量，最大值, 耗费,变化，比率，可点击,显示），资源（名称，数量，最大值，变化 ，比率 ,显示），科技（名称，数量，耗费，解锁, 显示）
 * */
var LazyGame = function (data) {
    this.data = data;
    var worker = data.worker;
    var res = data.res;
    var tech = data.tech;
    //计算能否进行运算
    var L_calc = function (r, num) {
        var sum = r['storage'] + num;
        if (sum > r['max']) {
            r['storage'] = r['max'];
            return false
        } else if (sum < 0) {
            return false
        } else {
            r['storage'] = sum;
        }
    };
    this.L_calc = L_calc;
    var L_ruler = function (r, num) {
        if (r['storage'] + num > r['max']) {
            return false
        } else {
            return true
        }
    };
    this.L_ruler = L_ruler;
    //计算能否进行购买,num为数字，则计算能否购买这么多
    var L_buy = function (unit, num) {
        var u;
        for (u in unit) {
            if (unit[u] * num > res[u]['storage']) {
                return false
            }
        }
        return true
    };
    this.L_buy = L_buy;
    //
    var L_cost = function (unit, num) {
        var u;
        for (u in unit) {
            res[u]['storage'] = res[u]['storage'] - unit[u] * num;
        }
    };
    this.L_cost = L_cost;
    //开始动态计算数据
    var speed = {gold: 0};
    this.addWorker = function (unit, num) {
        if (L_buy(unit['cost'], num) && L_ruler(unit, num)) {
            L_cost(unit['cost'], num);
            L_calc(unit, num);
            updateSpeed();
        }
    };
    this.addTech = function (unit, num) {
        if (L_buy(unit['cost'], num) && L_ruler(unit, num)) {
            L_cost(unit['cost'], num);
            L_calc(unit, num);
            console.info('tech success');
            updateSpeed();
        }
    };
    var updateSpeed = function () {
        var r, p, t;
        speed = {gold: 0};
        for (p in worker) {
            var temp_r;
            for (temp_r in worker[p]['res']) {
                speed[temp_r] += worker[p]['res'][temp_r] * worker[p]['storage'];
            }
        }
        console.info(speed);
        for (t in tech) {
            var temp_t;
            for (temp_t in tech[t]['res']) {
                if (tech[t]['storage'] != 0) {
                    console.info(speed[temp_t]);
                    speed[temp_t] = speed[temp_t] * tech[t]['res'][temp_t] * tech[t]['storage'];
                }

            }
        }
        for (r in res) {
            res[r]['speed'] = speed[r];
        }
    };

    this.resourse = function () {
        setInterval(function () {
//      计算资源
            var r, p, t;
//      计算单位
            for (p in worker) {
                //calc(pop[p], (pop[p].speed * pop[p].rate));
                if (L_buy(worker[p].cost, 1, true)) {
                    worker[p].click = true;
                }else{
                    worker[p].click = false;
                }
                if (worker[p]['storage'] == worker[p]['max']) {
                    worker[p]['click'] = false;
                }
            }
//      计算科技
            for (t in tech) {
                if (L_buy(tech[t].cost, 1, true)) {
                    tech[t].click = true;
                }else{
                    tech[t].click = false;
                }
                if (tech[t]['storage'] == tech[t]['max']) {
                    tech[t]['click'] = false;
                }
            }
            for (r in res) {
                L_calc(res[r], (res[r].speed));
            }
        }, 1000);
    }
};

var game = new LazyGame({
    res: {
        gold: {name: "gold", info: '黄金', storage: 0, max: 10000, speed: 0, click: true, display: true}
    },
    worker: {
        miner: {
            name: "普通矿工",
            info: '25金币',
            storage: 0,
            max: 99,
            speed: 0,
            rate: 0,
            cost: {gold: 25},
            res: {gold: 0.5},
            click: false,
            display: true
        },
        miner2: {
            name: "稀有矿工",
            info: '45金币',
            storage: 0,
            max: 99,
            speed: 0,
            rate: 0,
            cost: {gold: 45},
            res: {gold: 1},
            click: false,
            display: true
        },
        miner3: {
            name: "史诗矿工",
            info: '85金币',
            storage: 0,
            max: 99,
            speed: 0,
            rate: 0,
            cost: {gold: 85},
            res: {gold: 2},
            click: false,
            display: true
        },
        miner4: {
            name: "传说矿工",
            info: '165金币',
            storage: 0,
            max: 99,
            speed: 0,
            rate: 0,
            cost: {gold: 165},
            res: {gold: 4},
            click: false,
            display: true
        },
        miner5: {
            name: "探矿器",
            info: '320金币',
            storage: 0,
            max: 99,
            speed: 0,
            rate: 0,
            cost: {gold: 320},
            res: {gold: 8},
            click: false,
            display: true
        }
    },
    tech: {
        gold2: {
            name: '初级挖掘',
            info: '200金币|提升10%',
            storage: 0,
            max: 1,
            cost: {gold: 200},
            res: {gold: 1.1},
            click: false,
            display: true
        },
        gold3: {
            name: '中级挖掘',
            info: '1000金币|提升5%',
            storage: 0,
            max: 1,
            cost: {gold: 1000},
            res: {gold: 1.05},
            click: false,
            display: true
        },
        gold4: {
            name: '高级挖掘',
            info: '2000金币|提升5%',
            storage: 0,
            max: 1,
            cost: {gold: 2000},
            res: {gold: 1.05},
            click: false,
            display: true
        },
        gold5: {
            name: '炼金术',
            info: '4000金币|提升20%',
            storage: 0,
            max: 1,
            cost: {gold: 4000},
            res: {gold: 1.2},
            click: false,
            display: true
        }
    }
});
game.resourse();
var vm = new Vue({
    el: 'body',
    data: game['data'],
    methods: {
        buy: function (type, unit, num) {
            if (type == 'worker') {
                game.addWorker(unit, num);
            } else {
                game.addTech(unit, num);
            }
        },
        calc: function (unit, num) {
            game.L_calc(unit, num);
        }
    }
});
