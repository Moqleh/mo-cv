import{test,expect}from'@playwright/test';

test('mobile Arabic builder preserves RTL typing and stays within viewport',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'mobile-user',email:'mobile@example.test',name:'Mobile'}));localStorage.setItem('mocv.locale','ar')});
  await page.goto('/');
  await page.getByRole('button',{name:/AI Assistant|المساعد الذكي/}).click();
  await page.getByRole('button',{name:/إنشاء (سيرة جديدة|الآن)/}).first().click();
  await page.getByLabel('الاسم الكامل').fill('محمد العقلة');
  await page.getByLabel('المسمى الوظيفي').fill('مدير مالي');
  const skills=page.getByPlaceholder(/اكتب كل مهارة في سطر/);
  await skills.pressSequentially('تحليل مالي');
  await expect(skills).toHaveValue('تحليل مالي');
  await page.getByRole('button',{name:'إضافة لغة'}).click();
  await page.getByRole('textbox',{name:'اللغة'}).fill('العربية');
  await page.getByRole('textbox',{name:'المستوى'}).fill('اللغة الأم');
  await expect(page.locator('.cvPreview')).toHaveAttribute('dir','rtl');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('mobile PDF check always returns control to the user',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'mobile-pdf',email:'pdf@example.test',name:'PDF'}));localStorage.setItem('mocv.locale','en')});
  await page.goto('/');
  await page.getByRole('button',{name:/AI Assistant|المساعد الذكي/}).click();
  await page.getByRole('button',{name:/Create (New Resume|Now)/}).first().click();
  await page.getByLabel('Full Name').fill('Mobile PDF Test');
  await page.getByLabel('Job Title').fill('Finance Manager');
  await page.getByRole('checkbox').check();
  await page.route('**/functions/v1/cv-moderate',route=>route.abort());
  const pdf=page.getByRole('button',{name:/PDF/});
  await pdf.click();
  await expect(pdf).toBeEnabled({timeout:9000});
  await expect(page.locator('.editorStatus')).toContainText('press PDF to retry',{timeout:9000});
});


test('mobile dashboard stays inside viewport in English and Arabic',async({page})=>{
  await page.addInitScript(()=>{const r={schemaVersion:1,id:'mobile-card',title:'My Resume',locale:'en',template:'professional',updatedAt:new Date().toISOString(),personal:{fullName:'Mobile User',jobTitle:'Finance Manager',email:'',phone:'',location:'',website:'',linkedin:''},summary:'',experience:[],education:[],skills:[],languages:[],certifications:[],projects:[],courses:[],sectionOrder:['summary','experience','education','skills','languages','certifications','projects','courses']};localStorage.setItem('mocv.dev.user',JSON.stringify({id:'dash-mobile',email:'dash@test.invalid',name:'Mobile'}));localStorage.setItem('mocv.locale','en');localStorage.setItem('mocv.resumes.v1',JSON.stringify([r]))});
  await page.goto('/#/dashboard');
  await expect(page.getByRole('heading',{name:'Your Resumes'})).toBeVisible();
  const overflowEn=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflowEn).toBeLessThanOrEqual(2);
  const actions=page.locator('.resumeGrid article>div:last-child').first();if(await actions.count())expect(await actions.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(2);
  await page.locator('.globalLocale').click();
  await expect(page.getByRole('heading',{name:'سيرك الذاتية'})).toBeVisible();
  const overflowAr=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflowAr).toBeLessThanOrEqual(2);
});


test('mobile English builder keeps all controls English even for an Arabic resume',async({page})=>{
  await page.addInitScript(()=>{const r={schemaVersion:1,id:'mixed-locale',title:'سيرتي الذاتية',locale:'ar',template:'professional',updatedAt:new Date().toISOString(),personal:{fullName:'',jobTitle:'',email:'',phone:'',location:'',website:'',linkedin:''},summary:'',experience:[],education:[],skills:[],languages:[],certifications:[],projects:[],courses:[],sectionOrder:['summary','experience','education','skills','languages','certifications','projects','courses']};localStorage.setItem('mocv.dev.user',JSON.stringify({id:'mixed-user',email:'mixed@test.invalid',name:'Mixed'}));localStorage.setItem('mocv.locale','en');localStorage.setItem('mocv.resumes.v1',JSON.stringify([r]))});
  await page.goto('/#/dashboard');
  await page.getByRole('button',{name:'Edit'}).first().click();
  await expect(page.getByLabel('Resume name')).toHaveValue('My Resume');
  await expect(page.getByLabel('Resume language')).toHaveValue('ar');
  await expect(page.getByLabel('Resume template').locator('option:checked')).toHaveText('Professional');
  await expect(page.getByRole('button',{name:/Save/})).toBeVisible();
  await expect(page.getByText('Notice before finalizing your resume')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflow).toBeLessThanOrEqual(2);
});


test('mobile workspace keeps UI locale separate from resume content locale',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'parity-user',email:'parity@test.invalid',name:'Parity'}));localStorage.setItem('mocv.locale','en');localStorage.removeItem('mocv.resumes.v1')});
  await page.goto('/#/dashboard');
  await page.getByRole('button',{name:'Create New Resume'}).click();
  await expect(page.locator('.builderContext')).toContainText('Interface: English');
  await expect(page.locator('.builderContext')).toContainText('Resume: English');
  await page.getByLabel('Resume language').selectOption('ar');
  await expect(page.locator('.builderContext')).toContainText('Resume: العربية');
  await expect(page.locator('.cvPreview')).toHaveAttribute('dir','rtl');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
