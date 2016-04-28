---
title: Marius' Blog
---
{{#posts}}
  <article class="post">
    <div class="row">
      <div class="columns small-12 medium-9">
        <h3>[{{title}}](/posts/{{url}}.html)</h3>
        <p>{{{teaser}}}</p>
        <div class="text-right">
          [Read more...](/posts/{{url}}.html)
        </div>
      </div>
      <div class="columns small-12 medium-3">
        {{#tags}}
          <button class="button small hollow tag">{{.}}</button>
        {{/tags}}
        <p>published: {{published}}</p>
      </div>
    </div>
  </article>
{{/posts}}