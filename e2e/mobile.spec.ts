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
  await page.getByLabel('Full Name').fill('Mobile PDF Test');\n  await page.getByLabel('Job Title').fill('Finance Manager');
  await page.getByRole('checkbox').check();
  await page.route('**/functions/v1/cv-moderate',route=>route.abort());
  const pdf=page.getByRole('button',{name:/PDF/});
  await pdf.click();
  await expect(pdf).toBeEnabled({timeout:9000});
  await expect(page.locator('.editorStatus')).toContainText('press PDF to retry',{timeout:9000});
});
