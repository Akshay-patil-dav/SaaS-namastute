import{r as e}from"./rolldown-runtime-hePW80VL.js";import{Kt as t,O as n,Pt as r,St as i,Vt as a,Wt as o,in as s,kt as c,nn as ee,pt as te,q as l}from"./vendor-icons-BkxYM5iE.js";import{A as u,C as d,E as f,M as p,j as m,w as h}from"./vendor-misc-BJwiOJCI.js";import{a as g,o as _}from"./index-D8ntEMrD.js";import{n as v,t as y}from"./WebsiteFooter-1-hJTrw5.js";import{t as b}from"./blogData-Cz5stxcp.js";/* empty css                 */var x=e(s(),1),S=h(),C={Software:{bg:`rgba(99,102,241,0.12)`,color:`#6366f1`,border:`rgba(99,102,241,0.3)`},Development:{bg:`rgba(16,185,129,0.12)`,color:`#059669`,border:`rgba(16,185,129,0.3)`},Business:{bg:`rgba(245,158,11,0.12)`,color:`#d97706`,border:`rgba(245,158,11,0.3)`},Updates:{bg:`rgba(234, 88, 12, 0.12)`,color:`#ea580c`,border:`rgba(234, 88, 12, 0.35)`},Tutorial:{bg:`rgba(236,72,153,0.12)`,color:`#db2777`,border:`rgba(236,72,153,0.3)`},News:{bg:`rgba(14,165,233,0.12)`,color:`#0284c7`,border:`rgba(14,165,233,0.3)`},All:{bg:`rgba(100,116,139,0.12)`,color:`#475569`,border:`rgba(100,116,139,0.3)`}};function w(e){return C[e]||{bg:`rgba(234, 88, 12, 0.12)`,color:`#ea580c`,border:`rgba(234, 88, 12, 0.35)`}}function T(e){if(e?.coverEmoji&&!e.coverEmoji.includes(`?`))return e.coverEmoji;switch((e?.category||``).toLowerCase()){case`software`:return`💻`;case`development`:return`⚡`;case`business`:return`📈`;case`updates`:return`🚀`;case`tutorial`:return`📚`;case`news`:return`📰`;default:return`✨`}}function E(){let e=m(),s=u(),{slug:h}=p(),[C,E]=(0,x.useState)(()=>{if(s.state?.blog)return s.state.blog;try{let e=JSON.parse(localStorage.getItem(`namustutam_cached_blogs`)||`[]`).find(e=>e.slug===h);if(e)return e}catch{}return b.find(e=>e.slug===h)||null}),[ne,D]=(0,x.useState)(!1),[O,k]=(0,x.useState)(!C||!C.content),[A,j]=(0,x.useState)([]),[M,N]=(0,x.useState)(C?.likesCount||0),[P,F]=(0,x.useState)(()=>{try{return JSON.parse(localStorage.getItem(`namustutam_liked_blogs`)||`[]`).includes(h)}catch{return!1}}),[I,L]=(0,x.useState)(!1),[R,z]=(0,x.useState)(0),[B,V]=(0,x.useState)(()=>{try{return JSON.parse(localStorage.getItem(`blog_comments_${h}`)||`[]`)}catch{return[]}}),[H,U]=(0,x.useState)(``),[W,G]=(0,x.useState)(``);(0,x.useEffect)(()=>{let e=!0;return(async()=>{try{let t=await _.get(`/blog-posts/slug/${h}`);t.data&&e&&(E(t.data),N(t.data.likesCount||0),document.title=`${t.data.title} | Namustutam Blog`)}catch(t){if(console.warn(`Could not fetch article by slug from backend, using fallback:`,t),!C){let t=b.find(e=>e.slug===h);t&&e&&(E(t),N(t.likesCount||0),document.title=`${t.title} | Namustutam Blog`)}}finally{e&&k(!1)}})(),()=>{e=!1}},[h]),(0,x.useEffect)(()=>{(async()=>{try{let e=await _.get(`/blog-posts`);if(Array.isArray(e.data)){let t=e.data.filter(e=>e.slug!==h&&(!e.visibility||e.visibility===`Visible`)).slice(0,3);j(t)}}catch{let e=b.filter(e=>e.slug!==h).slice(0,3);j(e)}})()},[h]),(0,x.useEffect)(()=>{window.scrollTo(0,0);let e=()=>{let e=document.documentElement.scrollHeight-window.innerHeight;if(e>0){let t=Math.min(100,Math.max(0,window.scrollY/e*100));z(t)}};return window.addEventListener(`scroll`,e,{passive:!0}),()=>window.removeEventListener(`scroll`,e)},[h]);let K=async()=>{if(!P){N(e=>e+1),F(!0);try{let e=JSON.parse(localStorage.getItem(`namustutam_liked_blogs`)||`[]`);e.push(h),localStorage.setItem(`namustutam_liked_blogs`,JSON.stringify(e))}catch{}if(C?.id)try{await _.post(`/blog-posts/${C.id}/like`)}catch(e){console.warn(`Like request failed on backend:`,e)}}},q=typeof window<`u`?window.location.href:``,J=()=>{navigator.clipboard.writeText(q).then(()=>{L(!0),setTimeout(()=>L(!1),2500)})},Y=()=>{let e=encodeURIComponent(`Read "${C?.title}" on Namustutam:\n${q}`);window.open(`https://api.whatsapp.com/send?text=${e}`,`_blank`)},X=()=>{let e=encodeURIComponent(`"${C?.title}" via @Namustutam`);window.open(`https://twitter.com/intent/tweet?text=${e}&url=${encodeURIComponent(q)}`,`_blank`)},re=()=>{window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(q)}`,`_blank`)},ie=e=>{if(e.preventDefault(),!W.trim())return;let t=[{id:Date.now(),author:H.trim()||`Software Engineer`,text:W.trim(),date:new Date().toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})},...B];V(t);try{localStorage.setItem(`blog_comments_${h}`,JSON.stringify(t))}catch{}G(``)};if(O)return(0,S.jsxs)(`div`,{className:`lp-root blog-detail-root`,children:[(0,S.jsx)(v,{}),(0,S.jsxs)(`div`,{style:{minHeight:`80vh`,display:`flex`,alignItems:`center`,justifyContent:`center`,flexDirection:`column`,gap:16},children:[(0,S.jsx)(`div`,{style:{width:`36px`,height:`36px`,border:`3px solid rgba(255, 255, 255, 0.1)`,borderTopColor:`#ea580c`,borderRadius:`50%`,animation:`spin 0.7s linear infinite`}}),(0,S.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:15},children:`Loading article...`})]}),(0,S.jsx)(y,{})]});if(!C)return(0,S.jsxs)(`div`,{className:`lp-root blog-detail-root`,children:[(0,S.jsx)(v,{}),(0,S.jsxs)(`div`,{style:{minHeight:`80vh`,display:`flex`,alignItems:`center`,justifyContent:`center`,flexDirection:`column`,gap:16},children:[(0,S.jsx)(`div`,{style:{fontSize:64},children:`📭`}),(0,S.jsx)(`h2`,{style:{fontFamily:`Plus Jakarta Sans, sans-serif`,fontSize:26,fontWeight:800,color:`var(--text)`},children:`Article Not Found`}),(0,S.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:15},children:`This article may have been archived or moved.`}),(0,S.jsx)(`button`,{className:`lp-btn-primary`,onClick:()=>e(`/blog`),children:`Browse All Articles`})]}),(0,S.jsx)(y,{})]});let Z=w(C.category),ae=g.BACKEND_BASE_URL||`http://localhost:3000`,Q=!!C.imageUrl&&!ne,oe=Q&&C.imageUrl.startsWith(`/`)?`${ae}${C.imageUrl}`:C.imageUrl,se=T(C),ce=C.createdAt||C.date?new Date(C.createdAt||C.date).toLocaleDateString(`en-IN`,{day:`numeric`,month:`long`,year:`numeric`}):`Recently Published`,$=(C.author||`N`).charAt(0).toUpperCase();return(0,S.jsxs)(`div`,{className:`lp-root blog-detail-root`,children:[(0,S.jsx)(`div`,{className:`blog-reading-progress`,style:{width:`${R}%`}}),(0,S.jsx)(v,{}),(0,S.jsxs)(`div`,{className:`blog-detail-cover`,style:{background:Q?`#090d16`:C.coverColor||`linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,position:`relative`,overflow:`hidden`},children:[Q?(0,S.jsx)(`img`,{src:oe,alt:C.title,className:`blog-detail-hero-img`,loading:`eager`,onError:()=>D(!0)}):(0,S.jsx)(`span`,{className:`blog-detail-cover-emoji`,children:se}),(0,S.jsx)(`div`,{className:`blog-detail-cover-overlay`}),(0,S.jsxs)(`div`,{className:`blog-detail-cover-content`,children:[(0,S.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:6,marginBottom:14,fontSize:13,color:`rgba(255,255,255,0.7)`,flexWrap:`wrap`},children:[(0,S.jsx)(f,{to:`/`,style:{color:`rgba(255,255,255,0.8)`,textDecoration:`none`},children:`Home`}),(0,S.jsx)(a,{size:12}),(0,S.jsx)(f,{to:`/blog`,style:{color:`rgba(255,255,255,0.8)`,textDecoration:`none`},children:`Blog`}),(0,S.jsx)(a,{size:12}),(0,S.jsx)(`span`,{style:{color:Z.color,fontWeight:600},children:C.category})]}),(0,S.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,marginBottom:16,flexWrap:`wrap`},children:[(0,S.jsx)(`span`,{className:`blog-card-cat`,style:{background:`rgba(255,255,255,0.2)`,color:`white`,backdropFilter:`blur(8px)`,border:`1px solid rgba(255,255,255,0.35)`},children:C.category}),(0,S.jsxs)(`span`,{style:{color:`rgba(255,255,255,0.75)`,fontSize:13,display:`flex`,alignItems:`center`,gap:4},children:[(0,S.jsx)(r,{size:13}),` `,C.readTime||`5 min`,` read`]}),C.viewsCount>0&&(0,S.jsxs)(`span`,{style:{color:`rgba(255,255,255,0.75)`,fontSize:13,display:`flex`,alignItems:`center`,gap:4},children:[(0,S.jsx)(i,{size:13}),` `,C.viewsCount,` reads`]})]}),(0,S.jsx)(`h1`,{className:`blog-detail-cover-title`,children:C.title})]})]}),(0,S.jsxs)(`div`,{className:`blog-detail-layout`,children:[(0,S.jsxs)(`article`,{children:[(0,S.jsxs)(`div`,{className:`blog-detail-meta-bar`,children:[(0,S.jsxs)(`div`,{className:`blog-detail-author-info`,children:[(0,S.jsx)(`div`,{className:`blog-detail-avatar`,children:$}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`div`,{className:`blog-detail-author-name`,children:C.author||`Akshay Patil`}),(0,S.jsx)(`div`,{className:`blog-detail-author-role`,children:C.authorRole||`Founder & CTO`})]})]}),(0,S.jsx)(`span`,{className:`blog-detail-dot`,children:`·`}),(0,S.jsxs)(`span`,{className:`blog-detail-date`,style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,S.jsx)(t,{size:13}),` `,ce]}),(0,S.jsxs)(`div`,{style:{marginLeft:`auto`,display:`flex`,alignItems:`center`,gap:8},children:[(0,S.jsxs)(`button`,{onClick:J,className:`blog-share-btn`,title:`Copy article link`,children:[I?(0,S.jsx)(o,{size:14,color:`#10b981`}):(0,S.jsx)(c,{size:14}),(0,S.jsx)(`span`,{style:{fontSize:12},children:I?`Copied!`:`Share`})]}),(0,S.jsx)(`button`,{onClick:Y,className:`blog-share-icon-btn`,title:`Share on WhatsApp`,children:`💬`}),(0,S.jsx)(`button`,{onClick:X,className:`blog-share-icon-btn`,title:`Share on Twitter / X`,children:`𝕏`}),(0,S.jsx)(`button`,{onClick:re,className:`blog-share-icon-btn`,title:`Share on LinkedIn`,children:`in`})]})]}),C.excerpt&&(0,S.jsx)(`div`,{className:`blog-detail-lead-box`,children:(0,S.jsxs)(`p`,{style:{margin:0,fontSize:16,fontStyle:`italic`,color:`var(--text-2)`,lineHeight:1.7},children:[`"`,C.excerpt,`"`]})}),(0,S.jsx)(`div`,{className:`blog-detail-article`,children:(0,S.jsx)(d,{components:{img:({node:e,src:t,alt:n,...r})=>{let i=t?.startsWith(`/`)&&!t.startsWith(`//`)?`${g.BACKEND_BASE_URL||``}${t}`:t;return(0,S.jsxs)(`figure`,{className:`blog-article-figure`,style:{margin:`32px 0`,textAlign:`center`},children:[(0,S.jsx)(`img`,{src:i,alt:n||`Blog illustration`,loading:`lazy`,style:{maxWidth:`100%`,height:`auto`,borderRadius:`12px`,border:`1px solid rgba(255, 255, 255, 0.12)`,boxShadow:`0 8px 30px rgba(0, 0, 0, 0.35)`,margin:`0 auto`,display:`block`},...r}),n&&n.trim()!==``&&n!==`Blog Visual`&&(0,S.jsx)(`figcaption`,{style:{marginTop:`10px`,fontSize:`13px`,color:`var(--text-muted, #94a3b8)`,fontStyle:`italic`},children:n})]})},a:({node:e,href:t,children:n,...r})=>{let i=typeof t==`string`&&(/\.(jpeg|jpg|gif|png|webp|svg|avif|bmp)($|\?)/i.test(t)||t.includes(`images.unsplash.com`)||t.includes(`res.cloudinary.com`)||t.includes(`imgur.com`)||t.includes(`images.pexels.com`)||t.startsWith(`/uploads/`)),a=Array.isArray(n)?n.join(``):n?.toString()||``;if(i&&(!a||a===t||a.startsWith(`http`)||a.startsWith(`/uploads/`))){let e=t.startsWith(`/`)&&!t.startsWith(`//`)?`${g.BACKEND_BASE_URL||``}${t}`:t;return(0,S.jsx)(`figure`,{className:`blog-article-figure`,style:{margin:`32px 0`,textAlign:`center`},children:(0,S.jsx)(`img`,{src:e,alt:`Blog visual`,loading:`lazy`,style:{maxWidth:`100%`,height:`auto`,borderRadius:`12px`,border:`1px solid rgba(255, 255, 255, 0.12)`,boxShadow:`0 8px 30px rgba(0, 0, 0, 0.35)`,margin:`0 auto`,display:`block`},onError:e=>{e.target.style.display=`none`}})})}return(0,S.jsx)(`a`,{href:t,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#ff620b`,textDecoration:`underline`},...r,children:n})}},children:C.content?C.content.replace(/(^|\n)(https?:\/\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg|avif|bmp)(?:\?[^\s]*)?|\/uploads\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg|avif)|https?:\/\/(?:images\.unsplash\.com|res\.cloudinary\.com|images\.pexels\.com|imgur\.com)[^\s]+)(\n|$)/gi,(e,t,n,r)=>`${t}![Blog Visual](${n})${r}`):``})}),C.tags&&(0,S.jsx)(`div`,{className:`blog-detail-tags`,children:(Array.isArray(C.tags)?C.tags:C.tags.split(`,`)).filter(Boolean).map((e,t)=>(0,S.jsxs)(`span`,{className:`blog-detail-tag`,children:[`#`,e.trim()]},t))}),(0,S.jsxs)(`div`,{className:`blog-detail-reactions-bar`,children:[(0,S.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,S.jsxs)(`button`,{onClick:K,className:`blog-reaction-heart-btn ${P?`liked`:``}`,"aria-label":`Like article`,children:[(0,S.jsx)(te,{size:18,fill:P?`#f43f5e`:`none`,color:P?`#f43f5e`:`currentColor`}),(0,S.jsxs)(`span`,{children:[M,` `,M===1?`Like`:`Likes`]})]}),P&&(0,S.jsx)(`span`,{style:{fontSize:13,color:`var(--text-muted)`},children:`Thanks for reading and liking! ❤️`})]}),(0,S.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10},children:(0,S.jsxs)(`button`,{className:`blog-share-btn`,onClick:J,children:[I?(0,S.jsx)(o,{size:14,color:`#10b981`}):(0,S.jsx)(c,{size:14}),(0,S.jsx)(`span`,{children:I?`Link Copied!`:`Copy Link`})]})})]}),(0,S.jsxs)(`div`,{className:`blog-comments-section`,children:[(0,S.jsxs)(`h3`,{style:{fontSize:20,fontWeight:800,color:`var(--text)`,marginBottom:20,display:`flex`,alignItems:`center`,gap:8},children:[(0,S.jsx)(l,{size:20,color:`var(--primary)`}),`Discussion (`,B.length,`)`]}),(0,S.jsxs)(`form`,{onSubmit:ie,className:`blog-comment-form`,children:[(0,S.jsx)(`div`,{style:{display:`flex`,gap:12,marginBottom:12},children:(0,S.jsx)(`input`,{type:`text`,placeholder:`Your Name (optional)`,value:H,onChange:e=>U(e.target.value),className:`blog-comment-input`})}),(0,S.jsx)(`textarea`,{placeholder:`Share your perspective or ask a question regarding this article…`,value:W,onChange:e=>G(e.target.value),rows:3,className:`blog-comment-textarea`,required:!0}),(0,S.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,marginTop:10},children:(0,S.jsxs)(`button`,{type:`submit`,className:`lp-btn-primary`,style:{padding:`8px 20px`,fontSize:13},children:[(0,S.jsx)(n,{size:13,style:{marginRight:6}}),` Post Comment`]})})]}),B.length>0?(0,S.jsx)(`div`,{className:`blog-comments-list`,children:B.map(e=>(0,S.jsxs)(`div`,{className:`blog-comment-card`,children:[(0,S.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,marginBottom:6},children:[(0,S.jsx)(`div`,{style:{fontWeight:700,fontSize:14,color:`var(--text)`},children:e.author}),(0,S.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`},children:e.date})]}),(0,S.jsx)(`p`,{style:{margin:0,fontSize:14,color:`var(--text-2)`,lineHeight:1.6},children:e.text})]},e.id))}):(0,S.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:14,fontStyle:`italic`,marginTop:16},children:`No comments yet. Be the first to start the discussion!`})]}),(0,S.jsx)(`div`,{style:{marginTop:48},children:(0,S.jsxs)(`button`,{className:`lp-btn-ghost`,onClick:()=>e(`/blog`),children:[(0,S.jsx)(ee,{size:16,style:{marginRight:6}}),` Back to All Articles`]})})]}),(0,S.jsxs)(`aside`,{className:`blog-detail-sidebar`,children:[(0,S.jsxs)(`div`,{className:`blog-detail-sidebar-card`,children:[(0,S.jsx)(`div`,{className:`blog-sidebar-title`,children:`Author Profile`}),(0,S.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:14,marginBottom:12},children:[(0,S.jsx)(`div`,{className:`blog-detail-avatar`,style:{width:52,height:52,fontSize:22},children:$}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`div`,{style:{fontWeight:800,fontSize:16,color:`var(--text)`},children:C.author||`Akshay Patil`}),(0,S.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginTop:2},children:C.authorRole||`Founder & Software Architect`})]})]}),(0,S.jsx)(`p`,{style:{fontSize:13,color:`var(--text-muted)`,lineHeight:1.6,margin:0},children:`Architecting resilient enterprise software, AI automation pipelines, and high-performance multi-tenant SaaS systems.`})]}),A.length>0&&(0,S.jsxs)(`div`,{className:`blog-detail-sidebar-card`,children:[(0,S.jsx)(`div`,{className:`blog-sidebar-title`,children:`Related Insights`}),A.map(t=>(0,S.jsxs)(`div`,{className:`blog-sidebar-related-item`,onClick:()=>e(`/blog/${t.slug}`,{state:{blog:t}}),children:[(0,S.jsx)(`div`,{className:`blog-sidebar-emoji`,style:{background:t.coverColor||`var(--primary-pale)`},children:T(t)}),(0,S.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,S.jsx)(`div`,{className:`blog-sidebar-item-title`,children:t.title}),(0,S.jsxs)(`div`,{className:`blog-sidebar-item-date`,children:[t.readTime||`5 min`,` · `,t.category]})]})]},t.id||t.slug))]}),(0,S.jsxs)(`div`,{className:`blog-detail-sidebar-card`,style:{background:`var(--gradient, linear-gradient(135deg, #ff620b 0%, #c2410c 100%))`,border:`none`,color:`#fff`},children:[(0,S.jsx)(`div`,{style:{fontSize:32,marginBottom:10},children:`🚀`}),(0,S.jsx)(`div`,{style:{fontFamily:`Plus Jakarta Sans, sans-serif`,fontSize:18,fontWeight:800,color:`white`,marginBottom:8},children:`Need Custom Software?`}),(0,S.jsx)(`p`,{style:{fontSize:13,color:`rgba(255,255,255,0.85)`,lineHeight:1.65,marginBottom:18},children:`Partner with Namustutam to build high-scale SaaS architectures, modern web apps, and automated workflows.`}),(0,S.jsx)(`button`,{className:`lp-btn-primary`,style:{background:`white`,color:`#ea580c`,width:`100%`,borderRadius:10,fontWeight:700},onClick:()=>e(`/contact`),children:`Schedule Consultation →`})]})]})]}),(0,S.jsx)(y,{}),(0,S.jsx)(`style`,{children:`
                .blog-reading-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: var(--gradient, linear-gradient(90deg, #ea580c, #ff620b, #c2410c));
                    z-index: 9999;
                    transition: width 0.1s ease-out;
                    box-shadow: 0 0 10px rgba(234, 88, 12, 0.5);
                }
                .blog-detail-hero-img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    inset: 0;
                    object-fit: cover;
                }
                .blog-share-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    color: var(--text-2);
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .blog-share-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .blog-share-icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: 1px solid var(--border-soft);
                    background: var(--surface-solid);
                    color: var(--text-2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .blog-share-icon-btn:hover {
                    border-color: var(--primary);
                    background: var(--primary-pale, rgba(234, 88, 12, 0.1));
                }
                .blog-detail-lead-box {
                    padding: 20px 24px;
                    background: var(--surface-solid);
                    border-left: 4px solid var(--primary);
                    border-radius: 0 12px 12px 0;
                    margin-bottom: 36px;
                    box-shadow: var(--shadow-sm);
                }
                .blog-detail-reactions-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    border-radius: 14px;
                    margin: 40px 0;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .blog-reaction-heart-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--surface-sunken, rgba(255,255,255,0.05));
                    border: 1px solid var(--border-soft);
                    padding: 8px 18px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .blog-reaction-heart-btn:hover {
                    border-color: #f43f5e;
                    color: #f43f5e;
                    transform: scale(1.03);
                }
                .blog-reaction-heart-btn.liked {
                    background: rgba(244, 63, 94, 0.15);
                    border-color: #f43f5e;
                    color: #f43f5e;
                }
                .blog-comments-section {
                    margin-top: 48px;
                    padding-top: 36px;
                    border-top: 1px solid var(--border-soft);
                }
                .blog-comment-form {
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    border-radius: 12px;
                    padding: 18px;
                    margin-bottom: 24px;
                }
                .blog-comment-input {
                    width: 100%;
                    max-width: 320px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid var(--border-soft);
                    background: var(--surface-sunken, rgba(0,0,0,0.2));
                    color: var(--text);
                    font-size: 13px;
                    outline: none;
                }
                .blog-comment-textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid var(--border-soft);
                    background: var(--surface-sunken, rgba(0,0,0,0.2));
                    color: var(--text);
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                    outline: none;
                }
                .blog-comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-top: 16px;
                }
                .blog-comment-card {
                    padding: 14px 18px;
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    border-radius: 10px;
                }
                /* Markdown typography overrides */
                .blog-detail-article h2 {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 24px;
                    font-weight: 800;
                    color: var(--text);
                    margin: 36px 0 16px;
                    letter-spacing: -0.5px;
                }
                .blog-detail-article h3 {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 19px;
                    font-weight: 700;
                    color: var(--text);
                    margin: 28px 0 12px;
                }
                .blog-detail-article p {
                    font-size: 16px;
                    line-height: 1.8;
                    color: var(--text-2);
                    margin-bottom: 20px;
                }
                .blog-detail-article ul, .blog-detail-article ol {
                    margin: 16px 0 24px 24px;
                    color: var(--text-2);
                    line-height: 1.8;
                }
                .blog-detail-article li {
                    margin-bottom: 8px;
                }
                .blog-detail-article code {
                    background: rgba(234, 88, 12, 0.1);
                    color: var(--primary);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-family: monospace;
                }
                .blog-detail-article pre {
                    background: #0f172a;
                    padding: 18px 20px;
                    border-radius: 10px;
                    overflow-x: auto;
                    margin: 24px 0;
                    border: 1px solid var(--border-soft);
                }
                .blog-detail-article pre code {
                    background: transparent;
                    color: #e2e8f0;
                    padding: 0;
                }
                .blog-detail-article blockquote {
                    border-left: 4px solid var(--primary);
                    padding: 8px 18px;
                    margin: 20px 0;
                    background: var(--surface-sunken, rgba(255,255,255,0.03));
                    color: var(--text-muted);
                    font-style: italic;
                }
            `})]})}export{E as default};