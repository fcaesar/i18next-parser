import { assert } from 'chai'
import WebComponentsLexer from '../../src/lexers/webcomponents-lexer'

describe('WebComponentsLexer', () => {
  it('extracts keys from attributes on nested web components', (done) => {
    const Lexer = new WebComponentsLexer()
    const content = '<component><other-component data-i18n="first;second"></other-component></component>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'first' },
      { key: 'second' }
    ])
    done()
  })

  it('extracts keys from html attributes', (done) => {
    const Lexer = new WebComponentsLexer()
    const content = '<p data-i18n="first;second"></p>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'first' },
      { key: 'second' }
    ])
    done()
  })

  it('ignores leading [] of the key', (done) => {
    const Lexer = new WebComponentsLexer()
    const content = '<p data-i18n="[title]first;[prepend]second"></p>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'first' },
      { key: 'second' }
    ])
    done()
  })

  it('supports the defaultValue option', (done) => {
    const Lexer = new WebComponentsLexer()
    const content =
      '<p data-i18n="first" data-i18n-options=\'{"defaultValue": "bla"}\'>first</p>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'first', defaultValue: 'bla' }
    ])
    done()
  })

  it('grabs the default from innerHTML if missing', (done) => {
    const Lexer = new WebComponentsLexer()
    const content = '<p data-i18n>first</p>'
    assert.deepEqual(Lexer.extract(content), [{ key: 'first' }])
    done()
  })

  it('supports multiline', (done) => {
    const Lexer = new WebComponentsLexer()
    const content =
      '<p data-i18n="[title]third;fourth">Fourth</p>' +
      '<p\n title=""\n bla\n data-i18n="first"\n data-i18n-options=\'{"defaultValue": "bar"}\'></p>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'third' },
      { key: 'fourth' },
      { key: 'first', defaultValue: 'bar' }
    ])
    done()
  })

  it('skip if no key is found', (done) => {
    const Lexer = new WebComponentsLexer()
    const content = '<p data-i18n></p>'
    assert.deepEqual(Lexer.extract(content), [])
    done()
  })

  it('supports a `attr` option', (done) => {
    const Lexer = new WebComponentsLexer({ attr: 'data-other' })
    const content = '<p data-other="first;second"></p>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'first' },
      { key: 'second' }
    ])
    done()
  })

  it('supports a `optionAttr` option', (done) => {
    const Lexer = new WebComponentsLexer({ optionAttr: 'data-other-options' })
    const content =
      '<p data-i18n="first" data-other-options=\'{"defaultValue": "bar"}\'></p>'
    assert.deepEqual(Lexer.extract(content), [
      { key: 'first', defaultValue: 'bar' }
    ])
    done()
  })
})
