#!/usr/bin/osascript -l JavaScript

const chromiums =[
    'Google Chrome',
    'Google Chrome Canary',
    'Microsoft Edge',
    'Microsoft Edge Beta',
    'Chromium',
    'Opera',
    'Vivaldi',
    'Brave Browser',
];
const safaris = [
    'Safari',
    'Safari Technology Preview',
    'Webkit'
]

const frontmost_app_name = Application('System Events').applicationProcesses.where({frontmost: true}).name()[0];
const frontmost_app = Application(frontmost_app_name);

if(chromiums.indexOf(frontmost_app_name) > -1){
    var title = frontmost_app.windows[0].activeTab.name();
    var url = frontmost_app.windows[0].activeTab.url();
}else if(safaris.indexOf(frontmost_app_name) > -1){
    var title = frontmost_app.documents[0].name();
    var url = frontmost_app.documents[0].url();
} else {
    throw new Error("Can't find supported browser as front most app : " + frontmost_app_name);
}

url + '\n' + title;