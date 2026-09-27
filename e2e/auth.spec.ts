import{test,expect}from'@playwright/test';

test('landing language and auth navigation',async({page})=>{
 await page.goto('/');
 await expect(page.getByText('MO CV').first()).toBeVisible();
 await page.getByRole('button',{name:/ابدأ مجاناً الآن/}).click();
 await expect(page.getByRole('heading',{name:'إنشاء حساب'})).toBeVisible();
 await expect(page.getByRole('button',{name:/تسجيل الدخول/})).toBeVisible();
 await page.getByRole('button',{name:/تسجيل الدخول/}).click();
 await expect(page.getByRole('heading',{name:'تسجيل الدخول'})).toBeVisible();
 await expect(page.getByRole('button',{name:/إنشاء حساب جديد/})).toBeVisible();
});


test('password recovery link opens the dedicated reset form',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('mocv.locale','en'));
 await page.goto('/?recovery=1');
 await expect(page.getByRole('heading',{name:'Set a New Password'})).toBeVisible();
 await expect(page.getByLabel('New Password')).toBeVisible();
 await expect(page.getByLabel('Confirm New Password')).toBeVisible();
 await expect(page.getByRole('button',{name:/Update Password/})).toBeVisible();
});

test('English dashboard and builder stay English and templates are distinct',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('mocv.dev.user',JSON.stringify({id:'local-user',email:'english@example.test',name:'English User'}));localStorage.setItem('mocv.locale','en')});
 await page.goto('/#/dashboard');
 await expect(page.getByRole('heading',{name:'Your Resumes'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Create New Resume'})).toBeVisible();
 await page.getByRole('button',{name:/Create (New Resume|Now)/}).first().click();
 await expect(page.locator('.builder')).toHaveAttribute('dir','ltr');
 await expect(page.getByText('Personal Information',{exact:true}).first()).toBeVisible();
 const template=page.locator('.builderTop select').nth(1);
 const preview=page.locator('.cvPreview');
 await template.selectOption('classic');await expect(preview).toHaveClass(/classic/);
 await template.selectOption('professional');await expect(preview).toHaveClass(/professional/);
 await template.selectOption('modern');await expect(preview).toHaveClass(/modern/);
 await template.selectOption('creative');await expect(preview).toHaveClass(/creative/);
 await template.selectOption('elegant');await expect(preview).toHaveClass(/elegant/);
 await expect(page.getByText('حفظ',{exact:true})).toHaveCount(0);
});
