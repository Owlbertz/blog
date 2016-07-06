```config
title: Blogging
published: April 24, 2016
url: blogging
tags:
  - Blog
  - Gulp
layout: posts
```

This blog was made using Panini, a super simple flat file generator, Markdown, Handlebars and Gulp. The design is done with [Foundation for sites](http://foundation.zurb.com).

## My setup
The contents are written in Markdown and parsed with Marked. Afterwards, the magic happens with [Panini](https://github.com/zurb/panini), a Gulp plugin which assembles a site consisting of multiple pages. For every page a configuration can be made with Fron Matter in YAML. Additionally another Gulp tasks extracts the YAML information of all blog posts and puts them into a JSON file, which is then used to create the blog's start page.


## My contents
Basically I just wanted to do some advanced stuff with flat file generation and also wanted to have a place to write occasionally about things I am doing. In general this blog will be mostly about stuff I develop and general thoughts I have.                                                                                                                                                                                                                                                       