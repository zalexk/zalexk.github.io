'use strict';
// 兼容本地编辑器预览：正文图片路径写作 <文章slug>/文件名（相对 md 文件），
// 构建前剥掉 <slug>/ 前缀，让 marked 的 postAsset 按文章同名文件夹解析。

hexo.extend.filter.register('before_post_render', function (data) {
  const cfg = this.config;
  if (!cfg.post_asset_folder || !data.slug) return data;
  const slug = data.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`!\\[([^\\]]*)\\]\\(\\s*(?:\\./)?${slug}/`, 'g');
  data.content = data.content.replace(re, '![$1](');
  return data;
});
