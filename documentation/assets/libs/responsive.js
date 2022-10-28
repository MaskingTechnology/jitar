
let $menu = undefined;
let $button = undefined;

function initialize()
{
    $menu = $('nav');
    $button = $('header .button');

    $button.on('click', toggleMenu);
    $('nav a').on('click', closeMenu);
}

function isDisabled()
{
    return $button.css('display') === 'none';
}

function toggleMenu()
{
    $menu.css('display') === 'none' ? openMenu() : closeMenu();
}

function openMenu()
{
    if (isDisabled()) return;

    $menu.css('display', 'block');
    $button.html('&#10005;');
}

function closeMenu()
{
    if (isDisabled()) return;

    $menu.css('display', 'none');
    $button.html('&#9776;');
}

$(window).on('load', initialize);
