import{test,expect}from'@playwright/test';

test('AI-disabled core flow persists a resume and reaches PDF print',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'e2e@example.test',name:'E2E User'}));localStorage.setItem('mocv.locale','ar')});
  await page.goto('/');
  await page.getByRole('button',{name:'جرّب المساعد الذكي الآن ✨'}).click();
  await expect(page.getByRole('heading',{name:'سيرك الذاتية'})).toBeVisible();
  await page.getByRole('button',{name:/إنشاء (سيرة جديدة|الآن)/}).first().click();
  await expect(page.locator('.builder')).toBeVisible();
  await page.getByLabel('الاسم الكامل').fill('محمد اختبار');
  await page.getByLabel('المسمى الوظيفي').fill('مهندس برمجيات');
  await page.locator('.editor>textarea').first().fill('ملخص مهني للاختبار');
  await page.locator('.builderTop select').first().selectOption('en');
  await expect(page.locator('.cvPreview')).toHaveAttribute('dir','ltr');
  await expect(page.locator('.cvPreview').getByRole('heading',{name:'Professional Summary'})).toBeVisible();
  await expect(page.locator('.builder aside small')).toContainText('تم الحفظ تلقائياً',{timeout:5000});
  let printed=false;
  await page.exposeFunction('__e2ePrint',()=>{printed=true});
  await page.evaluate(()=>{window.print=()=>{void (window as any).__e2ePrint()}});
  await page.getByRole('button',{name:/PDF/}).click();
  await expect.poll(()=>printed).toBe(true);
  await page.getByRole('button',{name:/الرئيسية/}).first().click();
  await expect(page.getByRole('heading',{name:'سيرك الذاتية'})).toBeVisible();
  await expect(page.getByText('محمد اختبار')).toBeVisible();
  await page.getByRole('button',{name:'تسجيل الخروج'}).click();
  await page.getByRole('button',{name:'تسجيل الدخول'}).click();
  await page.getByLabel('البريد الإلكتروني').fill('e2e@example.test');
  await page.getByLabel('كلمة المرور').fill('password123');
  await page.getByRole('button',{name:'دخول'}).click();
  await expect(page.getByRole('heading',{name:'سيرك الذاتية'})).toBeVisible();
  await expect(page.getByText('محمد اختبار')).toBeVisible();
});



test('landing contact navigation works',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('mocv.locale','ar'));
  await page.goto('/');
  await page.getByRole('button',{name:'تواصل معنا'}).first().click();
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.locator('#contact a[href^="https://wa.me/"]')).toBeVisible();
  await expect(page.locator('#contact a[href^="mailto:"]')).toBeVisible();
});

test('landing language switch works',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('mocv.locale','ar'));
  await page.goto('/');
  await page.locator('.headerGlobe').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByText('Practical tools to write and organize your resume, check ATS compatibility, and export it as PDF.')).toBeVisible();
  await expect(page.getByText('Advertising Space',{exact:true})).toBeVisible();
  await expect(page.locator('main')).toHaveCSS('direction','ltr');
});

test('landing legal controls work in English',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('mocv.locale','en'));
  await page.goto('/');
  await page.locator('footer').getByRole('button',{name:'Privacy Policy'}).click();
  await expect(page.getByRole('heading',{name:'Privacy Policy'})).toBeVisible();
  await page.getByRole('button',{name:/Back|Home/}).click();
  await expect(page.locator('.hero')).toBeVisible();
});
