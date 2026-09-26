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
