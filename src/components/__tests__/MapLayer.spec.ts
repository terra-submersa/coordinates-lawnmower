import { describe, it, expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import MapLayer from '../MapLayer/MapLayer.vue';

describe('MapLayer', () => {
  it('renders properly', () => {
    const wrapper = mount(MapLayer, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        })],
      },
    });
    expect(wrapper.text()).toContain('Band');
  });
});
