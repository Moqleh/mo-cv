import{test,expect}from'@playwright/test';

test('landing navigation, FAQ, templates, locale, legal and contact controls are actionable',async({page})=>{
 await page.goto('/');
 for(const [name,id] of [['الميزات','features'],['القوالب','templates'],['كيف يعمل؟','how'],['الأسئلة الشائعة','faq'],['تواصل معنا','contact']] as const){
  await page.getByRole('button',{name,exact:true}).click();await expect(page.locator('#'+id)).toBeInViewport();
 }
 const firstTemplate=await page.locator('.templateRow article').first().innerText();await page.getByRole('button',{name:'القالب التالي'}).click();expect(await page.locator('.templateRow article').first().innerText()).not.toBe(firstTemplate);await page.getByRole('button',{name:'القالب السابق'}).click();
 const faq=page.locator('.faqGrid button').first();await faq.click();await expect(faq).toHaveAttribute('aria-expanded','true');await faq.click();await expect(faq).toHaveAttribute('aria-expanded','false');
 await expect(page.getByRole('link',{name:'WhatsApp'})).toHaveAttribute('href',/wa\.me\/962799880062/);await expect(page.getByRole('link',{name:'Email'})).toHaveAttribute('href',/^mailto:/);
 await page.getByRole('button',{name:'سياسة الخصوصية'}).click();await expect(page.getByRole('heading',{name:'سياسة الخصوصية'})).toBeVisible();await page.getByRole('button',{name:/الرئيسية/}).click();
 await page.getByRole('button',{name:'الشروط والأحكام'}).click();await expect(page.getByRole('heading',{name:'الشروط والأحكام'})).toBeVisible();
 await page.getByRole('button',{name:'English'}).click();await expect(page.getByRole('heading',{name:'Terms & Conditions'})).toBeVisible();await expect(page.locator('main.legal')).toHaveAttribute('dir','ltr');
 await page.getByRole('button',{name:/Home/}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');
});

test('dashboard primary actions create, rename, duplicate, edit and delete a resume',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'audit-user',email:'audit@example.test',name:'Audit'}));localStorage.setItem('mocv.locale','en')});
 await page.goto('/#/dashboard');await page.getByRole('button',{name:'Create New Resume'}).click();await expect(page.getByLabel('Resume name')).toBeVisible();await page.getByLabel('Resume name').fill('Executive CV');await page.getByRole('button',{name:'Home'}).first().click();
 await expect(page.getByText('Executive CV')).toBeVisible();
 page.once('dialog',async d=>{expect(d.type()).toBe('prompt');await d.accept('Executive CV 2026')});await page.getByRole('button',{name:'Rename'}).click();await expect(page.getByText('Executive CV 2026')).toBeVisible();
 await page.getByRole('button',{name:'Duplicate'}).click();await expect(page.locator('.resumeGrid article')).toHaveCount(2);
 const first=page.locator('.resumeGrid article').first();await first.getByRole('button',{name:'Edit'}).click();await expect(page.locator('.cvPreview')).toBeVisible();await page.getByRole('button',{name:'Home'}).first().click();
 page.once('dialog',async d=>{expect(d.type()).toBe('confirm');await d.accept()});await page.locator('.resumeGrid article').first().getByRole('button',{name:'Delete'}).click();await expect(page.locator('.resumeGrid article')).toHaveCount(1);
});
