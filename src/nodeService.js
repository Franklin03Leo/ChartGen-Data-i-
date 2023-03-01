const Service = require('node-windows').Service
const svc = new Service({
    name:'DataEye Node',
    description:'Data(I) node service',
    script:'F:\\Xavier\\ReactJS\\DynamicChart\\dynamic_chart_genarator\\src\\server.js'
})

svc.on('install',function(){
    svc.start();
})
svc.install();