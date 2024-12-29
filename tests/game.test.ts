import { mount } from '@vue/test-utils';
import game from '../pages/index.vue';

describe('index.vue', () => {
  it('devrait avoir le bouton 2048 checked par défaut', async () => {
    const wrapper = mount(game);

    // Attendre que le DOM soit complètement rendu
    await wrapper.vm.$nextTick();

    // Vérifier la présence de l'élément
    const radio2048 = wrapper.find('input[type="radio"][value="2048"]');

    // Vérifier que l'élément existe avant d'essayer d'accéder à son état
    expect(radio2048.exists()).toBe(true);

    // Vérifier que le bouton est checked
    expect((radio2048.element as HTMLInputElement).checked).toBe(true);
  });

  it("should not have the 'Infini' button checked by default", async () => {
    const wrapper = mount(game);

    // Attendre que le DOM soit complètement rendu
    await wrapper.vm.$nextTick();

    // Vérifier la présence de l'élément
    const radioInfini = wrapper.find("input[type='radio'][id='Infini']");

    // Vérifier que l'élément existe avant d'essayer d'accéder à son état
    expect(radioInfini.exists()).toBe(true);

    // Vérifier que le bouton n'est pas checked
    expect((radioInfini.element as HTMLInputElement).checked).toBe(false);
  });
});
