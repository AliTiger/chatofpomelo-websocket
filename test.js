/**
 * Created by lixiaodong on 14-8-21.
 */
//var users = 'li*1';
//var a = users.split('*')[0];
//var b = users.split('*')[1];
//console.log('a:',a);
//console.log('b:',b);
//var maxLength = 30;
//var content = '【成员】李晓东[1001]#1001';
//var propName = '皇城霸主-1';
//var emojiLength = 4;
//var length;
//var a = content.split('[');
//if(a[1]){
//    var b = a[1].split(']');
//    if(b[0]){
//        console.log('b:',b[0]);
//        length = content.length - b[0].length+propName.length;
//        console.log('length:',length);
//    }
//}
//
//var index = content.indexOf('#');
//if(index!=-1){
//    var tmp = content.slice(index+1,index+5);
//    console.log('tmp:',tmp);
//    length = length - 5 +emojiLength;
//}
//console.log('length:',length);
//if(length > maxLength){
//    next(null,{
//        status:10
//    });
//}


//var content = 'dsadsa===djsak[]llsajdk';
//var temp ;
//if(test.indexOf('[')!=-1 && test.lastIndexOf(']')!=-1){
//    temp = test.substring(0,test.indexOf('[')).length;
//    temp += test.substring(test.lastIndexOf(']')+1).length;
//    console.log('tmp:',temp);
//}

//var test = function(){
////    this.test1 = function(){
////        console.log('====');
////    }
//}
//
////
//test.test1 = function(){console.log('====')};
//
//console.log(test.test1());
//
//var Test = function(){
//    this.name = 'aaa';
//}
//
//var test2 = function(aaa,bbb){
//    this.name = 'aaa';
//    console.log('======',this.name,aaa,bbb);
//}
//
//var test = new Test();
//console.log(test.name);
//test2('dsadsa');
//test2.call(test,'dsadsa','sdas');


////函数也是一个对象
//function baseClass()
//{
//    this.showMsg = function()
//    {
//        console.log("baseClass::showMsg");
//    }
//
//    this.baseShowMsg = function()
//    {
//        console.log("baseClass::baseShowMsg");
//    }
//}
////类方法
//baseClass.showMsg = function()
//{
//    console.log("baseClass::showMsg static");
//}
//
//function extendClass()
//{
//    this.showMsg =function ()
//    {
//        console.log("extendClass::showMsg");
//    }
//}
//extendClass.showMsg = function()
//{
//    console.log("extendClass::showMsg static")
//}
//
//
//extendClass.prototype = new baseClass();
//var instance = new extendClass();
//
////如果对象有自己的方法 则执行自己的方法 没有则执行继承过来的方法
//instance.showMsg(); //显示extendClass::showMsg
//instance.baseShowMsg(); //显示baseClass::baseShowMsg
//
////执行类方法
//baseClass.showMsg.call(instance);//显示baseClass::showMsg static
//var baseinstance = new baseClass();
////执行对象方法
//baseinstance.showMsg.call(instance);//显示baseClass::showMsg

var content = 'hijkkkkkkkk[1001]oooo';
var propName = content.split('[')[1].split(']')[0];
console.log('porpName:',propName);