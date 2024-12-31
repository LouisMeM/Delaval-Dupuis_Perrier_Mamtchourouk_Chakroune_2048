import { mount } from '@vue/test-utils';
import index from '../pages/index.vue';

describe('index.vue', () => {
  it('devrait avoir le bouton 2048 checked par défaut', async () => {
    const wrapper = mount(index);

    // Vérifie que le bouton 2048 est sélectionné par défaut
    const radio2048 = wrapper.find('input[type="radio"][value="2048"]');
    expect(radio2048.exists()).toBe(true);
    expect((radio2048.element as HTMLInputElement).checked).toBe(true);
  });

  it("should not have the 'Infini' button checked by default", async () => {
    const wrapper = mount(index);

    // Vérifie que le bouton Infini n'est pas sélectionné par défaut
    const radioInfini = wrapper.find('input[type="radio"][value="Infini"]');
    expect(radioInfini.exists()).toBe(true);
    expect((radioInfini.element as HTMLInputElement).checked).toBe(false);
  });

  it('devrait avoir le bouton 4x4 checked par défaut', async () => {
    const wrapper = mount(index);

    // Vérifie que le bouton 4x4 est sélectionné par défaut
    const radio4x4 = wrapper.find('input[type="radio"][value="4"]');
    expect(radio4x4.exists()).toBe(true);
    expect((radio4x4.element as HTMLInputElement).checked).toBe(true);
  });

  it('devrait avoir les boutons 5x5, 6x6, 7x7 non checked par défaut', async () => {
    const wrapper = mount(index);

    // Vérifie que les boutons 5x5, 6x6, 7x7 ne sont pas sélectionnés par défaut
    const radio5x5 = wrapper.find('input[type="radio"][value="5"]');
    const radio6x6 = wrapper.find('input[type="radio"][value="6"]');
    const radio7x7 = wrapper.find('input[type="radio"][value="7"]');
    expect(radio5x5.exists()).toBe(true);
    expect((radio5x5.element as HTMLInputElement).checked).toBe(false);
    expect(radio6x6.exists()).toBe(true);
    expect((radio6x6.element as HTMLInputElement).checked).toBe(false);
    expect(radio7x7.exists()).toBe(true);
    expect((radio7x7.element as HTMLInputElement).checked).toBe(false);
  });
});
