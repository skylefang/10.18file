$(function(){
    /*产生扑克牌，有由花色数字组成
    * 梅花：c
    * 方片：d
    * 红桃：h
    * 黑桃：s
    * */
    let color = ['c','d','h','s'];
    let poke = [];
    let flag = {};
    let btnR = $('div.btnR')
    /*
    * {hua:'c',num:1},{hua:'h',num:2}
    * 加入flag后[{hua:'c',num:1},{hua:'h',num:2}]
    * c_1:true,h_2:true   hua_num
    * */
    /*for(let i=0;i<52;i++){
        let hua = color[Math.floor(Math.random()*color.length)];
        let num = Math.floor(Math.random()*13+1);
        while(flag[`${hua}_${num}`]){
            hua = color[Math.floor(Math.random()*color.length)];
            num = Math.floor(Math.random()*13+1);
        }
       poke.push({hua,num});
       flag[`${hua}_${num}`]=true;

    }
    console.log(poke);*/
    while(poke.length < 52){
        let hua = color[Math.floor(Math.random()*color.length)];
        let num = Math.floor(Math.random()*13+1);
        if(!flag[`${hua}_${num}`]){
            poke.push({hua,num});
            flag[`${hua}_${num}`]=true;
        }
    }
    let index = 0;   // 始终记录当前发的是第几张扑克牌
    /*poke[index] => {hua:c,num:10}   obj.num+obj.hua+'.png'*/
    for(let i=0;i<7;i++){
        for(let j=0;j<=i;j++){
            let left = 300-50*i + 110*j,
                top = 50*i;
            $('<div>').addClass('poke box')
                .attr('id',`${i}_${j}`)  // 给每个扑克牌绑一个id坐标
                // .attr('num',poke[index].num)  对应点数
                .data('num',poke[index].num)   // 对应点数  用data和attr都可以 给data绑了一个num的属性 index对应的num
                // .html(`${poke[index]['hua']}---${poke[index]['num']}`).appendTo('.zhuozi')
                .css({backgroundImage:`url(img/${poke[index].num}${poke[index].hua}.png)`}).appendTo('.zhuozi')
                .delay(index*10).animate({left,top,opacity:1});
            index++;
        }
    }
    // 剩余的牌
    for(;index<poke.length;index++){
        $('<div>').addClass('poke zuo')
            .attr('id',`${-2}_${-2}`)    // 设置一个永远不会被压住的id
            // .attr('id',`${index}_${index}`)
            .data('num',poke[index].num)  // 对应点数
            // .attr('num',poke[index].num)
            // .html(`${poke[index]['hua']}---${poke[index]['num']}`).appendTo('.zhuozi')
            .css({backgroundImage:`url(img/${poke[index].num}${poke[index].hua}.png)`}).appendTo('.zhuozi')
            .delay(index*10).animate({left:0,top:'460px',opacity:1});
    }
    //  游戏
    // 使用事件委派  第一次点击是选中，第二次点击才是判断
    /*
    *
    * */
    let first = null;  // 判断点击的是第几次   first 用来记录点击 没有点击时就是!first
    $('.zhuozi').on('click','.poke',function(e){  //事件委派poke的事件委派给了zhuozi
        let element = $(e.target);   // e.target是原生的用$打包一下
        /*    $(element).css('box-shadow','0 0 0 3px #0A95DA').animate({top:'-=10'})
        })*/
        // '0_0' => 0,0  1,0   ids[0]为x是字符串，需转换
        let ids = element.attr('id').split('_');
        let ele1 = `#${ids[0]*1 + 1}_${ids[1]*1}`;
        let ele2 = `#${ids[0]*1 + 1}_${ids[1]*1+1}`
        // 有一个存在，即被压住，就直接return掉，判断是否被压住 $(ele1).length 判断是否存在，存在表示被压住，所以上面的抬不起来，因为jQuery获取回来的都是对象，没有时获取回来的是一个空对象
        if($(ele1).length || $(ele2).length){
             return;
        }
        // 点击时抬起加一个active类 再次点击放下
        element.toggleClass('active');
        if(element.hasClass('active')) {   // 判断是否有active类，有时去掉，没有时加上element.is('.active')也能进行判断
            element.animate({top: '-=20'})
        } else {
            element.animate({top: '+=20'})
        }
        // 点数
        if (!first) {
            // 第一次点击  first没值 是进行选择  用first记录第一次点击的牌
            /*first = $(e.target);*/
            first = element;  // 这两种写法相同
        } else {
            // 第二次点击进行判断       第一次的牌与第二次的牌对应的是first与 element
            // $('.active')用active相当于一次获取两张即first加element 所以需要加下标载进行打包
           if(first.data('num') + element.data('num')==14){
               // num相加等于14就飞走  回调函数function表示动画完要执行的功能
              $('.active').animate({left:600,top:0,opacity:0},function(){
                  $(this).remove();
              })
           }else{
              $('.active').animate({top:'+=20'},function(){
                  $(this).removeClass('active')
              })
           }
          // 点完两次后又重新开始
          first = null;
        }
        /*
        * 获取点数也可使用 $('.active')用active相当于一次获取两张即first加element 所以需要加下标载进行打包
        * 或者使用each()
        * */

    })
    // 操作zuo   last()与eq(-1)都是最后一张  往右边放牌时后面的层级要比前面的高
    let zindex = 0;
    btnR.on('click',function(){
        if(!$('.zuo').length){
            return;
        }
        $('.zuo').eq(-1).css('zIndex',zindex++).animate({left:660}).removeClass('zuo').addClass('you')
    });
    $('div.btnL').on('click',function () {
        if(!$('.you').length){return;}
        // zindex = 0;
       /* $('.you').css('zIndex',zindex++).delay(zindex*10)
            .animate({left:600}).removeClass('you').addClass('zuo')
    */
       // 右边无法使用下标，所以使用each中的index
        $('.you').each(function(index){
            $(this).css('zIndex',zindex++).delay(index*100)
                .animate({left:0}).removeClass('you').addClass('zuo')
        })
    })
})


