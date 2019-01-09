export default {
  form: `
<select
  ref="{{input.ref ? input.ref : 'selectContainer'}}"
  class="ui search dropdown"
  {{ input.multiple ? 'multiple' : '' }}
  {% for (var attr in input.attr) { %}
  {{attr}}="{{input.attr[attr]}}"
  {% } %}
>{{options}}</select>
`,
  html: '<div ref="value">{% if (options) { %}{{options}}{% } else { %}-{% } %}</div>'
};
