// 后台页面
app.get('/ckadmin', (c) => {
  return c.html(adminHtml);
});

// 退出确认页面（统一主题）
app.get('/ckadmin/logout-confirm', (c) => {
  const logoutPageHtml = `
<!DOCTYPE html>
<html lang="zh-CN" data-theme="${localStorage.getItem('theme')||'dark'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>退出确认</title>
<style>
${sharedStyles}
.confirm-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:12px;
  padding:32px;
  width:min(90%,420px);
  box-shadow:0 10px 40px rgba(0,0,0,0.25);
}
.confirm-card h2{
  color:var(--text-bright);
  margin:0 0 12px;
  font-size:1.3rem;
}
.confirm-desc{
  color:var(--text-dim);
  line-height:1.6;
  margin-bottom:28px;
}
.btn-group{
  display:flex;
  gap:12px;
  justify-content:flex-end;
}
.btn-cancel{
  background:var(--surface-2);
  color:var(--text);
  border:1px solid var(--border);
}
.btn-cancel:hover{
  background:var(--bg-hover);
}
.btn-confirm{
  background:var(--red);
  color:#fff;
}
.btn-confirm:hover{
  background:var(--red-dim);
}
.btn-cancel,.btn-confirm{
  padding:10px 20px;
  border-radius:8px;
  border:none;
  font-size:15px;
  cursor:pointer;
  transition:0.2s;
}
body{
  background:var(--bg);
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0;
}
</style>
<script>(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)})()</script>
</head>
<body>
<div class="confirm-card">
  <h2>确认退出后台管理？</h2>
  <p class="confirm-desc">退出后本地存储的管理员令牌将被清除，需重新输入 token 才能进入后台。</p>
  <div class="btn-group">
    <button class="btn-cancel" id="cancelBtn">取消</button>
    <button class="btn-confirm" id="confirmBtn">确认退出</button>
  </div>
</div>
<script>
const token = localStorage.getItem('adminToken');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

cancelBtn.onclick = () => window.location.href = '/ckadmin';

confirmBtn.onclick = async () => {
  try {
    await fetch('/ckadmin/logout', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    })
  } catch (e) {}
  localStorage.removeItem('adminToken');
  alert('已成功退出登录');
  window.location.href = '/';
}
</script>
</body>
</html>
  `;
  return c.html(logoutPageHtml);
});

// 登出接口（使用你现有的 verifyAdmin 鉴权）
app.post('/ckadmin/logout', async (c) => {
  const req = c.req.raw;
  const cfg = c.env.APP_CONFIG;
  const authorized = verifyAdmin(req, cfg);
  if (!authorized) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return c.json({ success: true, msg: '登出完成' });
});
