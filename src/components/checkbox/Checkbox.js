import _ from 'lodash';
import Component from '../_classes/component/Component';

export default class CheckBoxComponent extends Component {
  static schema(...extend) {
    return Component.schema({
      type: 'checkbox',
      inputType: 'checkbox',
      label: 'Checkbox',
      key: 'checkbox',
      dataGridLabel: true,
      labelPosition: 'right',
      value: '',
      name: ''
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Checkbox',
      group: 'basic',
      icon: 'check-square',
      documentation: 'http://help.form.io/userguide/#checkbox',
      weight: 50,
      schema: CheckBoxComponent.schema()
    };
  }

  get defaultSchema() {
    return CheckBoxComponent.schema();
  }

  get defaultValue() {
    return this.component.name ? '' : (this.component.defaultValue || false).toString() === 'true';
  }

  get className() {
    let className = super.className;
    if (this.component.input
      && !this.options.inputsOnly
      && this.component.validate
      && this.component.validate.required) {
      className += ' field-required';
    }
    return `${className} checkbox`;
  }

  get inputInfo() {
      const info = super.elementInfo();
    info.type = 'input';
    info.changeEvent = 'click';
    info.attr.type = this.component.inputType || 'checkbox';
    info.attr.class = 'form-check-input';
    if (this.component.name) {
      info.attr.name = `data[${this.component.name}]`;
    }
    info.attr.value = this.component.value ? this.component.value : 0;
    info.label = this.t(this.component.label);
    info.labelClass = this.className;
    return info;
  }

  render() {
    return super.render(this.renderTemplate('checkbox', {
      input: this.inputInfo,
      checked: this.dataValue,
    }));
  }

  attach(element) {
    this.loadRefs(element, { input: 'multiple' });
    this.input = this.refs.input[0];
    if (this.refs.input.length) {
      this.addEventListener(this.input, this.inputInfo.changeEvent, () => this.updateValue());
    }
    super.attach(element);
  }

  get emptyValue() {
    return false;
  }

  isEmpty(value) {
    return super.isEmpty(value) || value === false;
  }

  /**
   *
   * @param value {*}
   * @returns {*}
   */
  set dataValue(value) {
    const setValue = (super.dataValue = value);
    if (this.component.name) {
      _.set(this.data, this.component.key, setValue === this.component.value);
    }
    return setValue;
  }

  get dataValue() {
    const getValue = super.dataValue;
    if (this.component.name) {
      _.set(this.data, this.component.key, getValue === this.component.value);
    }
    return getValue;
  }

  get key() {
    return this.component.name ? this.component.name : super.key;
  }

  getValueAt(index) {
    if (this.component.name) {
      return this.refs.input[index].checked ? this.component.value : '';
    }
    return !!this.refs.input[index].checked;
  }

  getValue() {
    const value = super.getValue();
    if (this.component.name) {
      return value ? this.setCheckedState(value) : this.setCheckedState(this.dataValue);
    }
    else {
      return !!value;
    }
  }

  setCheckedState(value) {
    if (!this.input) {
      return;
    }
    if (this.component.name) {
      this.input.value = (value === this.component.value) ? this.component.value : 0;
      this.input.checked = (value === this.component.value) ? 1 : 0;
    }
    else if (value === 'on') {
      this.input.value = 1;
      this.input.checked = 1;
    }
    else if (value === 'off') {
      this.input.value = 0;
      this.input.checked = 0;
    }
    else if (value) {
      this.input.value = 1;
      this.input.checked = 1;
    }
    else {
      this.input.value = 0;
      this.input.checked = 0;
    }
    if (this.input.checked) {
      this.input.setAttribute('checked', true);
    }
    else {
      this.input.removeAttribute('checked');
    }
    return value;
  }

  setValue(value, flags) {
    flags = this.getFlags.apply(this, arguments);
    if (this.setCheckedState(value) !== undefined) {
      return this.updateValue(flags);
    }
  }

  getView(value) {
    return value ? 'Yes' : 'No';
  }
}
