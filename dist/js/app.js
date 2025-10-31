import { computePosition, autoUpdate, shift, offset, flip } from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.4/+esm';

$(document).ready(function () {
  const activeCleanups = new Map();

  function OpenDropdown(button, dropdown) {
    const buttonEl = button[0];
    const dropdownEl = dropdown[0];

    if (!button || !dropdown) return;

    dropdown.toggleClass('hidden');

    const cleanup = autoUpdate(buttonEl, dropdownEl, () => {
      computePosition(buttonEl, dropdownEl, {
        placement: 'bottom-end',
        middleware: [offset(8), flip(), shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(dropdownEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });

    activeCleanups.set(dropdownEl, cleanup);
  }

  function CloseDropdown(dropdown) {
    const dropdownEl = dropdown[0];

    if (!dropdownEl || !activeCleanups.has(dropdownEl)) return; // El dropdown ya está cerrado o no es válido

    dropdown.addClass('hidden');

    const cleanup = activeCleanups.get(dropdownEl);
    cleanup();

    activeCleanups.delete(dropdownEl);
  }

  function CloseAllDropdowns() {
    $('[data-dropdown]').each(function () {
      CloseDropdown($(this));
    });
  }

  $(document).on('click', '[data-dropdown-toggle]', function (event) {
    event.stopPropagation();

    const button = $(this);
    const targetId = button.data('dropdown-toggle');
    const dropdown = $(`#${targetId}`);

    if (!dropdown[0]) return;

    const isOpen = activeCleanups.has(dropdown[0]);

    // Cerrar Dropdowns abiertos
    $('[data-dropdown]')
      .not(dropdown)
      .each(function () {
        CloseDropdown($(this));
      });

    if (isOpen) {
      CloseDropdown(dropdown);
    } else {
      OpenDropdown(button, dropdown);
    }
  });

  $(document).on('click', function (event) {
    const target = $(event.target);

    if (!target.closest('[data-dropdown-toggle]').length && !target.closest('[data-dropdown]').length) {
      CloseAllDropdowns();
    }
  });
});
