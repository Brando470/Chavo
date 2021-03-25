//imports
importScripts('js/sw-utils.js');




//creamos 3 constantes para almacenar los tres tipos de cache
const STATIC_CACHE = "static-v4";
const DYNAMIC_CACHE = "dinamyc-v1";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL =[ //corazon de la aplicacion, appshel estatico
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/chavo.jpg',
    'img/avatars/chilindrina.jpg',
    'img/avatars/donramon.jpg',
    'img/avatars/doñaflorinda.jpg',
    'img/avatars/kiko.jpg',
    'js/app.js',
    'js/sw-utils.js'
    
];

const APP_SHELL_INMUTABLE = [  //cache inmutable
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e=>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));//pasamos los archivos al cache estatico

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE));//pasamos los archivos al cache inmutable

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));//esperamos a que los caches finalicen
});

self.addEventListener('activate', e=>{
    const respuesta= caches.keys().then(keys=>{

        keys.forEach(key=>{
            //static-v1
            if(key!=STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }  
        });  
    });   
        e.waitUntil(respuesta);
   
});

//cache-only
self.addEventListener('fetch', e=>{

    caches.match(e.request).then(res=>{
        if(res){
            return res;
        }
        else{
            return fetch(e.request).then(newRes =>{

                return actualizarCacheDinamico(DYNAMIC_CACHE,e.request,newRes);
            });
        }
    });
    e.responWith(respuesta);
})


