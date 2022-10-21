
const CONTENT_TOP_OFFSET = 100;
const ACTIVATION_OFFSET = 150;
const SCROLL_SPEED = 1000;

function initialize()
{
    const navigationMap = getNavigationMap();
    const navigationList = [...navigationMap.values()];

    const content = $('main');
    content.on('scroll', () => update(content, navigationList));

    appendScrollInfo(content, navigationList);
    addClickAction(content, navigationList);

    if (window.location.hash !== '')
    {
        const section = navigationMap.get(window.location.hash);

        scrollToSelection(content, section.top);
    }
}

function getNavigationMap()
{
    const links = getNavigationLinks();

    return filterPageItems(links);
}

function getNavigationLinks()
{
    const elements = $('nav a');
    const links = [];

    elements.each(index => links.push($(elements[index])));

    return links;
}

function filterPageItems(links)
{
    const items = new Map();

    links.forEach(link =>
    {
        const hash = extractHash(link);

        if (hash === null) return;

        const section = $(hash);

        if (section.length === 0) return;

        const item = { link: link, section: section };

        items.set(hash, item);
    });

    return items;
}

function extractHash(link)
{
    const href = link.attr('href');
    const index = href.indexOf('#');

    if (index === -1) return null;

    return href.substring(index);
}

function addClickAction(content, items)
{
    items.forEach(item =>
    {
        item.link.on('click', event =>
        {
            event.preventDefault();

            scrollToSelection(content, item.top);

            window.location.hash = extractHash(item.link);
        });
    });
}

function appendScrollInfo(content, items)
{
    content.scrollTop(0);
    
    let previousTop = Number.MAX_SAFE_INTEGER;

    for (let index = items.length - 1; index > -1; index--)
    {
        const item = items[index];

        item.top = item.section.position().top;
        item.bottom = previousTop;

        previousTop = item.top;
    }
}

function scrollToSelection(content, offset)
{
    content.stop().animate({ scrollTop: offset - CONTENT_TOP_OFFSET }, SCROLL_SPEED);
}

function update(content, items)
{
    const scrollTop = content.scrollTop();
    const activeItem = pickActiveItem(items, scrollTop);

    items.forEach(item =>
    {
        item === activeItem
            ? item.link.addClass('active')
            : item.link.removeClass('active');
    });
}

function pickActiveItem(items, scrollTop)
{
    return items.find(item => isSectionActive(item, scrollTop));
}

function isSectionActive(item, scrollTop)
{
    const itemTop = item.top - CONTENT_TOP_OFFSET - ACTIVATION_OFFSET;
    const itemBottom = item.bottom - CONTENT_TOP_OFFSET - ACTIVATION_OFFSET;

    return scrollTop >= itemTop && scrollTop < itemBottom;
}

$(window).on('load', initialize);
