import Vue from 'vue';
import Hello from 'src/components/Attendee';

describe('Attendee.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Hello);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.row h2').textContent)
      .to.equal('發言申請');
  });
});
