import{test,expect}from'@playwright/test';

test('AI-disabled core flow persists a resume and reaches PDF print',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'e2e@example.test',name:'E2E User'}));localStorage.setItem('mocv.locale','ar')});
  await page.goto('/');
  await page.getByRole('button',{name:/AI Assistant|المساعد الذكي/}).click();
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
  await page.getByRole('checkbox').check();
  await page.route('**/functions/v1/cv-moderate',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({allowed:true,categories:[],reason:'ok'})}));
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

test('landing legal controls work',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('mocv.locale','ar'));
  await page.goto('/');
  await page.locator('footer').getByRole('button',{name:'سياسة الخصوصية'}).click();
  await expect(page.getByRole('heading',{name:'سياسة الخصوصية'})).toBeVisible();
  await page.getByRole('button',{name:/الرئيسية/}).click();
  await expect(page.locator('.hero')).toBeVisible();
});


test('final CV renders all professional sections and printable layout safely',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'final@example.test',name:'Final CV'}));localStorage.setItem('mocv.locale','en')});
  await page.goto('/');
  await page.getByRole('button',{name:/AI Assistant|المساعد الذكي/}).click();
  await page.getByRole('button',{name:/Create (New Resume|Now)/}).first().click();
  await page.locator('.builderTop select').first().selectOption('en');
  await page.getByLabel('Full Name').fill('Mohammed Al-Oqleh');
  await expect(page.locator('.cvPreview h1')).toHaveText('Mohammed Al-Oqleh');
  await page.getByLabel('Job Title').pressSequentially('Senior Finance Professional');
  await page.getByLabel('Email').fill('candidate@example.com');
  await page.getByLabel('Phone').fill('+966500000000');
  await page.getByLabel('Location').fill('Riyadh, Saudi Arabia');
  await page.locator('.editor>textarea').first().fill('Experienced professional focused on measurable business outcomes, leadership and operational excellence.');
  await page.getByRole('button',{name:'Add Experience'}).click();
  const entry=page.locator('.entry').first();
  await entry.locator('input').nth(0).fill('Finance Manager');
  await entry.locator('input').nth(1).fill('Example Company');
  await entry.locator('textarea').fill('Led planning, reporting and process improvement initiatives with measurable outcomes.');
  await page.getByRole('button',{name:'Add Education'}).click();
  await page.getByRole('button',{name:'Add Certification'}).click();
  await page.getByRole('button',{name:'Add Project'}).click();
  await page.getByRole('button',{name:'Add Course'}).click();
  await page.getByPlaceholder('React, TypeScript, Leadership...').fill('Financial Analysis, Leadership, Budgeting, Reporting');
  await page.getByPlaceholder('Arabic: Native, English: Advanced').fill('Arabic: Native, English: Advanced');
  const preview=page.locator('.cvPreview');
  await expect(preview.getByText('Mohammed Al-Oqleh')).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Professional Summary'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Experience'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Education'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Certifications'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Projects'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Courses'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Skills'})).toBeVisible();
  await expect(preview.getByRole('heading',{name:'Languages'})).toBeVisible();
  await expect(preview).toHaveAttribute('dir','ltr');
  await expect(preview).toHaveCSS('overflow','visible');
  const sections=preview.locator('.cvSection');
  for(let i=0;i<await sections.count();i++){
    const box=await sections.nth(i).boundingBox();
    if(box) expect(box.width).toBeLessThanOrEqual((await preview.boundingBox())!.width+1);
  }
});


test('Arabic final CV preserves every entered field and RTL output',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'arabic@example.test',name:'Arabic CV'}));localStorage.setItem('mocv.locale','ar')});
  await page.goto('/');
  await page.getByRole('button',{name:/AI Assistant|المساعد الذكي/}).click();
  await page.getByRole('button',{name:/إنشاء (سيرة جديدة|الآن)/}).first().click();
  const p=page.locator('.cvPreview');
  await page.getByLabel('الاسم الكامل').fill('محمد العقلة');
  await page.getByLabel('المسمى الوظيفي').fill('مدير مالي');
  await page.getByLabel('البريد الإلكتروني').fill('arabic@example.com');
  await page.getByLabel('الهاتف').fill('+966500000001');
  await page.getByLabel('الموقع').first().fill('الرياض، السعودية');
  await page.getByLabel('الموقع الإلكتروني').fill('https://example.com');
  await page.getByLabel('LinkedIn').fill('https://linkedin.com/in/example');
  await page.locator('.editor>textarea').first().fill('ملخص مهني عربي شامل.');
  await expect(p).toHaveAttribute('dir','rtl');
  await expect(p).toHaveAttribute('lang','ar');
  for(const value of ['محمد العقلة','مدير مالي','arabic@example.com','+966500000001','الرياض، السعودية','https://example.com','https://linkedin.com/in/example','ملخص مهني عربي شامل.']) await expect(p.getByText(value,{exact:false})).toBeVisible();
  for(const heading of ['الملخص المهني']) await expect(p.getByRole('heading',{name:heading})).toBeVisible();
});

test('all five templates preserve CV content in Arabic and English',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'templates@example.test',name:'Templates'}));localStorage.setItem('mocv.locale','en')});
  await page.goto('/');
  await page.getByRole('button',{name:/AI Assistant|المساعد الذكي/}).click();
  await page.getByRole('button',{name:/Create (New Resume|Now)/}).first().click();
  await page.getByLabel('Full Name').fill('Template Verification');
  await expect(page.locator('.cvPreview h1')).toHaveText('Template Verification');
  const preview=page.locator('.cvPreview');
  const templateSelect=page.locator('.builderTop select').nth(1);
  for(const id of ['classic','professional','modern','creative','elegant']){
    await templateSelect.selectOption(id);
    await expect(preview).toHaveClass(new RegExp(id));
    await expect(preview.getByText('Template Verification')).toBeVisible();
  }
  await page.locator('.builderTop select').first().selectOption('ar');
  await expect(preview).toHaveAttribute('dir','rtl');
  await expect(preview).toHaveAttribute('lang','ar');
  for(const id of ['classic','professional','modern','creative','elegant']){
    await templateSelect.selectOption(id);
    await expect(preview).toHaveClass(new RegExp(id));
    await expect(preview.getByText('Template Verification')).toBeVisible();
  }
});


test('secure export requires acknowledgement and fails closed when moderation is unavailable',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'security@example.test',name:'Security'}));localStorage.setItem('mocv.locale','en')});
  await page.goto('/#/dashboard');
  await page.getByRole('button',{name:/Create (New Resume|Now)/}).first().click();
  await page.getByLabel('Full Name').fill('Security Verification');
  let printed=false;await page.exposeFunction('__securePrint',()=>{printed=true});await page.evaluate(()=>{window.print=()=>{void (window as any).__securePrint()}});
  await page.getByRole('button',{name:/PDF/}).click();
  await expect(page.getByRole('status')).toContainText('responsibility acknowledgement');
  expect(printed).toBe(false);
  await page.getByRole('checkbox').check();
  await page.route('**/functions/v1/cv-moderate',async route=>route.abort());
  await page.getByRole('button',{name:/PDF/}).click();
  await expect(page.getByRole('status')).toContainText('safety check could not be completed');
  expect(printed).toBe(false);
});

test('secure export blocks rejected moderation and prints only allowed content',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'moderation@example.test',name:'Moderation'}));localStorage.setItem('mocv.locale','en')});
  await page.goto('/#/dashboard');await page.getByRole('button',{name:/Create (New Resume|Now)/}).first().click();await page.getByLabel('Full Name').fill('Moderation Verification');await page.getByRole('checkbox').check();
  let printed=false;await page.exposeFunction('__moderationPrint',()=>{printed=true});await page.evaluate(()=>{window.print=()=>{void (window as any).__moderationPrint()}});
  await page.route('**/functions/v1/cv-moderate',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({allowed:false,severity:'standard',categories:['unprofessional'],strikes30d:1,suspended:false})}));
  await page.getByRole('button',{name:/PDF/}).click();await expect(page.getByRole('status')).toContainText('Export was blocked');expect(printed).toBe(false);
  await page.unroute('**/functions/v1/cv-moderate');await page.route('**/functions/v1/cv-moderate',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({allowed:true,categories:[],reason:'ok'})}));
  await page.getByRole('button',{name:/PDF/}).click();await expect.poll(()=>printed).toBe(true);
});


test('required responsibility terms and CV issue reporting are visible and actionable',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'requirements@example.test',name:'Requirements'}));localStorage.setItem('mocv.locale','ar')});
  await page.goto('/#/dashboard');await page.getByRole('button',{name:/إنشاء (سيرة جديدة|الآن)/}).first().click();
  await expect(page.getByRole('note')).toContainText('أنت المسؤول الأول');
  await expect(page.getByRole('note')).toContainText('يمنع استخدام الخدمة');
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('button',{name:'الإبلاغ عن مشكلة في السيرة'})).toBeVisible();
  await page.getByRole('button',{name:'الإبلاغ عن مشكلة في السيرة'}).click();
  await expect(page.getByLabel('نوع المشكلة')).toBeVisible();
  await expect(page.getByRole('button',{name:'إرسال البلاغ'})).toBeVisible();
});
