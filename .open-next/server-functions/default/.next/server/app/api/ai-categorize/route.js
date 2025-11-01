"use strict";(()=>{var e={};e.id=874,e.ids=[874],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},71568:e=>{e.exports=require("zlib")},5725:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g});var a={};r.r(a),r.d(a,{POST:()=>l});var o=r(73278),n=r(45002),i=r(54877),s=r(71309),c=r(56746),p=r(86660);let u=new c.ZP({apiKey:process.env.OPENAI_API_KEY});async function l(e){try{let{transactions:t,userId:r}=await e.json();if(!t||!Array.isArray(t))return s.NextResponse.json({error:"Invalid transactions data"},{status:400});let a=(0,p.l)(),{data:o}=await a.from("categories").select("id, name, type").eq("user_id",r),n=o?.map(e=>`${e.name} (${e.type})`)||[],i=t.map((e,t)=>`${t+1}. "${e.description}" - Amount: ${e.amount}`).join("\n"),c=`Analyze these financial transactions and assign each one to an existing category.

IMPORTANT RULES:
- You can ONLY use categories from the existing list below
- DO NOT create new categories
- If you're not confident about a category match, return null for that transaction
- Match categories based on the transaction description

Existing categories: ${n.join(", ")}

Transactions:
${i}

Respond with a JSON array (one object per transaction) in this exact format:
[
  {
    "index": 0,
    "categoryName": "exact category name from list" or null,
    "confidence": "high" or "medium" or "low"
  }
]

Return null for categoryName if:
- No existing category fits well
- You're uncertain about the match
- The confidence would be "low"`,l=await u.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"system",content:"You are a financial categorization assistant. Respond only with valid JSON."},{role:"user",content:c}],temperature:.3}),d=l.choices[0]?.message?.content;if(!d)throw Error("No response from AI");let m=d.trim();m.startsWith("```json")?m=m.replace(/^```json\n?/,"").replace(/\n?```$/,""):m.startsWith("```")&&(m=m.replace(/^```\n?/,"").replace(/\n?```$/,""));let g=JSON.parse(m).map(e=>{let t=null;if(e.categoryName){let r=o?.find(t=>t.name.toLowerCase()===e.categoryName.toLowerCase());t=r?.id||null}return{index:e.index,categoryId:t,categoryName:e.categoryName,confidence:e.confidence}});return s.NextResponse.json({categorizations:g})}catch(e){return console.error("AI categorization error:",e),s.NextResponse.json({error:e.message||"Failed to categorize transactions"},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/ai-categorize/route",pathname:"/api/ai-categorize",filename:"route",bundlePath:"app/api/ai-categorize/route"},resolvedPagePath:"/Users/hector.alvarez/Desktop/Other/Finance/app/api/ai-categorize/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:x}=d,h="/api/ai-categorize/route";function f(){return(0,i.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}},86660:(e,t,r)=>{r.d(t,{l:()=>n});var a=r(35671),o=r(52845);let n=()=>(0,a.createServerComponentClient)({cookies:o.cookies})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[787,506,833,746],()=>r(5725));module.exports=a})();