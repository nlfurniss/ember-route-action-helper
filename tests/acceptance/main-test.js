import Route from '@ember/routing/route';
import Component from '@ember/component';
import { test } from 'ember-qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import hbs from 'htmlbars-inline-precompile';

moduleForAcceptance('Acceptance | main', {
  beforeEach: function(assert) {
    this.application.register('route:dynamic', Route.extend({
      actions: {
        foo() {
          assert.ok(true, 'action was properly triggered on the route');
        }
      }
    }));
    this.application.register('route:dynamic3', Route.extend({
      actions: {
        async bar() {
          assert.ok(true, 'async functions are found');
        }
      }
    }));
    this.application.register('template:dynamic', hbs`{{parent-component go=(route-action 'foo') }}`);
    this.application.register('template:components/parent-component', hbs`{{child-component go=go}}`);
    this.application.register('template:components/child-component', hbs`<button class="do-it">GO!</button>`);
    this.application.register('component:child-component', Component.extend({
      click() {
        this.get('go')();
      }
    }));
  }
});

test('it bubbles a route action', function(assert) {
  visit('/thing');

  andThen(() => assert.equal(currentURL(), '/thing'));
  andThen(() => click('.foo-button'));
  andThen(() => assert.equal(findWithAssert('.foo-value').text().trim(), 'Hello world Bob!'));
});

test('it has a return value', function(assert) {
  visit('/thing');

  andThen(() => assert.equal(currentURL(), '/thing'));
  andThen(() => click('.thing .max-button'));
  andThen(() => assert.equal(findWithAssert('.thing .max-value').text().trim(), '20'));

  // changing routes, 2 helpers invoked
  andThen(() => visit('/thing/show'));
  andThen(() => assert.equal(currentURL(), '/thing/show'));
  andThen(() => click('.thing-show .max-button'));

  // ensure values are different
  andThen(() => assert.equal(findWithAssert('.thing .max-value').text().trim(), '20'));
  andThen(() => assert.equal(findWithAssert('.thing-show .max-value').text().trim(), '300'));
});

test('it can be used without rewrapping with (action (route-action "foo"))', function(assert) {
  assert.expect(1);
  visit('/dynamic');
  click('.do-it');
});
