(self.webpackChunk_michael_blog=self.webpackChunk_michael_blog||[]).push([[625],{9249:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return o}});var l=a(2784),n=a(5780),r=a(9238),m=a(8447),s=a(891),c=function(e){var t=e.previousPagePath,a=e.nextPagePath;return l.createElement("div",{className:"flex items-center justify-between mt-16 md:w-4/5 mx-auto"},t&&l.createElement(m.Link,{to:t,className:"button"},l.createElement(s.Z,{name:"arrow-left"}),"Previous"),a&&l.createElement(m.Link,{to:a,className:"button ml-auto"},"Next",l.createElement(s.Z,{name:"arrow-right"})))},i=function(e){var t=e.posts,a=e.previousPagePath,m=e.nextPagePath,s=e.pageTitle,i=e.pageExcerpt;return l.createElement(n.Z,{pageTitle:s,pageExcerpt:i},t&&t.map((function(e){return l.createElement(r.Z,Object.assign({},e,{key:e.id}))})),l.createElement(c,{previousPagePath:a,nextPagePath:m}))},o=function(e){var t=e.pageContext,a=e.data;return l.createElement(i,Object.assign({posts:a.allPost.posts},t))}},9238:function(e,t,a){"use strict";var l=a(2784),n=a(8447),r=a(6123);t.Z=function(e){var t=e.title,a=e.slug,m=e.image,s=e.date,c=e.excerpt;return c=c.length>150?c.substr(0,150)+"...":c,l.createElement(n.Link,{to:a,className:"hover:no-underline group rounded md:-mx-8 md:p-8 block hover:bg-eggshell dark-hover:bg-text",title:'Go to the "'+t+'" post'},l.createElement("article",{className:"flex-col md:flex md:flex-row justify-between"},l.createElement("div",{className:"md:w-1/2 md:pr-4 lg:pr-10"},m&&"svg"===m.extension?l.createElement("img",{src:m.publicURL,className:"rounded-sm",alt:"Image for "+t,title:t}):l.createElement(r.Z,{fluid:m.thumbnail.fluid,className:"rounded-sm",imgStyle:{objectFit:"contain"},alt:"Image for "+t,title:t})),l.createElement("div",{className:"mx-4 md:mx-0 md:w-1/2 py-4 md:py-0 lg:py-6 md:pl-4 lg:pl-2"},l.createElement("h2",{className:"text-text dark:text-white"},t),l.createElement("small",{className:"mt-2 block"},s),c&&l.createElement("p",{className:"mt-5 text-text dark:text-white",dangerouslySetInnerHTML:{__html:c}}))))}}}]);
//# sourceMappingURL=component---packages-gatsby-theme-blog-core-src-templates-posts-query-js-0040942107a38ae7a3ce.js.map