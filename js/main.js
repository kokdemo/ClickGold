/**
 * Created by JiaHao on 2014/10/10 0010.
 */
var vm = new Vue({
        el: 'body',
        data: {
            ruler:{population:0},
            number:[1,10,100,1000,10000,100000,1000000],
            resource:{
                efficiency: 1,
                wood:{storage:0,maxStorage:200,addSpeed:0},
                food:{storage:0,maxStorage:200,addSpeed:0},
                stone:{storage:0,maxStorage:200,addSpeed:0},
                clothes:{storage:0,maxStorage:200,addSpeed:0},
                medicine:{storage:0,maxStorage:200,addSpeed:0},
                metal:{storage:0,maxStorage:200,addSpeed:0},
                gold:{storage:0,maxStorage:200,addSpeed:0},
                happy:{storage:0,maxStorage:200,addSpeed:0},
                territory:{storage:0,maxStorage:200,addSpeed:0}
            },
            population:{
                all:{storage:0,maxStorage:20,addSpeed:0,cost:{wood:10,food:0,stone:0,clothes:0,medicine:0,metal:0,gold:0,happy:0,territory:0}}
            }
            
        },
        filters: {
        },
        methods: {
            addResource: function(resource,efficiency){
                if(resource['storage'] < resource['maxStorage']){
                    resource['storage'] += efficiency;
                }
            },
            subtractResource: function(type,number){
                var temp = vm.$data.resource;
                var resourceList = ['wood','food','stone','clothes','medicine','metal','gold','happy','territory'];
                var check =0;
                for (var i=0;i< resourceList.length;i++){
                    console.info(resourceList[i]+"||"+temp[resourceList[i]]);
                    var tempObject = temp[resourceList[i]];
                    if(tempObject.storage - type.cost[resourceList[i]]*number >= 0){
                        check++;
                    }
                }
                if(check == 9){
                    for (var i=0;i< resourceList.length;i++){
                        temp[resourceList[i]].storage -= type.cost[resourceList[i]]*number;
                    }
                    return 1
                }else{
                    return 0
                }
            },
            addPeople: function(type,number){
                if(type['storage'] < type['maxStorage']){
                    if(this.subtractResource(type,number) == 1){
                        type['storage'] += number;
                    }
                }
            }
        }
});