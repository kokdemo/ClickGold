/**
 * Created by JiaHao on 2014/10/10 0010.
 */
/**
 * vm是vuejs的核心对象，由于数据已经绑定，因此数据修改在vm.$data上完成。
 * cm封装全局对象和方法，封装好的方法在jquery中直接执行之外，也供vuejs的方法调用。
 * vm的方法中会封装一些页面上的方法。
*/

var vm = new Vue({
        el: 'body',
        data: {
            ruler: {population: 0},
            number: [1, 10, 100, 1000, 10000, 100000, 1000000],
            resource: {
                wood: {name:"wood",storage: 0, maxStorage: 200, addSpeed: 0},
                food: {name:"food",storage: 0, maxStorage: 200, addSpeed: 0},
                stone: {name:"stone",storage: 0, maxStorage: 200, addSpeed: 0},
                clothes: {name:"clothes",storage: 0, maxStorage: 200, addSpeed: 0},
                medicine: {name:"medicine",storage: 0, maxStorage: 200, addSpeed: 0},
                metal: {name:"metal",storage: 0, maxStorage: 200, addSpeed: 0},
                gold: {name:"gold",storage: 0, maxStorage: 200, addSpeed: 0},
                happy: {name:"happy",storage: 0, maxStorage: 200, addSpeed: 0},
                territory: {name:"territory",storage: 0, maxStorage: 200, addSpeed: 0}
            },
            //人口 all是全部，分别有数量，最大数量，增加速度，每购买一个人的消耗，和维护一个人的损耗
            population: {
                all: {
                    name: "all",
                    storage: 0,
                    maxStorage: 20,
                    addSpeed: 0,
                    cost: {wood: 0, food: 20, stone: 0, clothes: 0, medicine: 0, metal: 0, gold: 0, happy: 0, territory: 0},
                    consume: {wood: 0, food: 1, stone: 0, clothes: 0, medicine: 0, metal: 0, gold: 0, happy: 0, territory: 0}
                },
                farmer:{
                    name:"farmer",
                    storage: 0,
                    maxStorage: 20,
                    addSpeed: 0,
                    cost: {wood: 5, food: 0, stone: 0, clothes: 0, medicine: 0, metal: 0, gold: 0, happy: 0, territory: 0},
                    consume: {wood: 0, food: -1.5, stone: 0, clothes: 0, medicine: 0, metal: 0, gold: 0, happy: 0, territory: 0}
                }

            }

        },
        filters: {
        },
        methods: {
            addResource: function (resource, efficiency) {
                cm.addResource(resource, efficiency);
            },
            subtractResource: function (type, number) {
                cm.subtractResource(type,number);
            },
            //购买人口
            addPeople: function (type, number) {
                if (type['storage'] < type['maxStorage']) {
                    if (cm.ifEnoughResource(type, number) == cm.resourceList.length) {
                        type['storage'] += number;
                        //验证是否是人口分配
                        if(type.name =! 'all'){
                            vm.$data.population.all['storage'] -=number;

                        }
                        cm.subtractResource(type, number);
                        for (var i = 0; i < cm.resourceList.length; i++) {
                            //计算人口损耗
                            vm.$data.resource[cm.resourceList[i]].addSpeed -= type.consume[cm.resourceList[i]] * number;
                        }
                    }
                }
            },
            addWorker: function(type, number) {
                if (type['storage'] < type['maxStorage']) {
                    if (cm.ifEnoughResource(type, number) == cm.resourceList.length) {
                        //验证是否是人口分配
                        if(vm.$data.population.all['storage'] - number >=0){
                            vm.$data.population.all['storage'] -= number;
                            type['storage'] += number;
                            cm.subtractResource(type, number);
                            for (var i = 0; i < cm.resourceList.length; i++) {
                                //计算人口加成
                                vm.$data.resource[cm.resourceList[i]].addSpeed -= type.consume[cm.resourceList[i]] * number;
                            }
                        }
                    }
                }
            },
            subWorker: function(type, number){
                if (type['storage'] >= number) {
                    if(vm.$data.population.all['storage'] + number <= vm.$data.population.all['maxStorage']){
                        vm.$data.population.all['storage'] += number;
                        type['storage'] -= number;
                        for (var i = 0; i < cm.resourceList.length; i++) {
                            //去除人口加成
                            vm.$data.resource[cm.resourceList[i]].addSpeed += type.consume[cm.resourceList[i]] * number;
                        }
                    }
                }
            }
        }
    })
    ;
 var show = vm.$data.resource;
var cm = {
    resourceList:['wood', 'food', 'stone', 'clothes', 'medicine', 'metal', 'gold', 'happy', 'territory'],
    //资源增加
    addResource: function (resource, efficiency) {
        if (resource['storage'] < resource['maxStorage']) {
            resource['storage'] += efficiency;
        }
    },
    //资源减少
    subResource: function (resource,efficiency) {
        if (resource['storage'] > efficiency){
            resource['storage'] -= efficiency;
        }
    },
    //资源减少，有校验，可以认为是资源购买过程
    ifEnoughResource: function(type,number){
        var temp = vm.$data.resource;
        var check = 0;
        var resLength = cm.resourceList.length;
        for (var i = 0; i < resLength; i++) {
            var tempObject = temp[cm.resourceList[i]];
            if (tempObject.storage - type.cost[cm.resourceList[i]] * number >= 0) {
                check++;
            }
        }
        return check
    },
    subtractResource: function (type, number) {
        var temp = vm.$data.resource;
        var resLength = cm.resourceList.length;
        var check = this.ifEnoughResource(type,number);
        console.info(check);
        if (check == resLength) {
            for (var i = 0; i < resLength; i++) {
                temp[cm.resourceList[i]].storage -= type.cost[cm.resourceList[i]] * number;
            }
            return 1
        } else {
            return 0
        }
    },
    liquidateResource: function () {
        var temp = vm.$data.resource;
            setInterval(function () {
                for (var i = 0; i < cm.resourceList.length; i++) {
                    var tempResource =temp[cm.resourceList[i]];
                    //cm.subResource(temp[cm.resourceList[i]].storage,temp[cm.resourceList[i]].addSpeed);
                    if(tempResource.storage > 0){
                        temp[cm.resourceList[i]].storage += tempResource.addSpeed;
                    }
                    //temp[cm.resourceList[i]].storage += temp[cm.resourceList[i]].addSpeed;
                }
            }, 1000);
    },
    init: function () {
        this.liquidateResource();
    }
};
$(document).ready(function(){
    cm.init();
});