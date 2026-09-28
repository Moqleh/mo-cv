import{defineConfig,devices}from'@playwright/test';
export default defineConfig({
  testDir:'./e2e',
  timeout:30_000,
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  projects:[
    {name:'desktop-chromium',testIgnore:/mobile\.spec\.ts/},
    {name:'mobile-android',testMatch:/mobile\.spec\.ts/,use:{viewport:{width:412,height:915},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131 Mobile Safari/537.36'}},
    {name:'mobile-webkit',testMatch:/mobile\.spec\.ts/,use:{...devices['iPhone 15 Pro'],browserName:'webkit'}}
  ],
  webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI}
});
