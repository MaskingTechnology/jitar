
class ScrollComponent
{
    #component = null;
    #links = null;

    constructor()
    {
        this.#component = document.querySelector('[scroll-component]') ?? window;
        this.#links = [...document.querySelectorAll('[scroll-link]')];

        this.#addEventListeners();
    }

    #addEventListeners()
    {
        this.#links.forEach(link =>
        {
            link.addEventListener('click', event =>
            {
                event.preventDefault();

                const href = link.getAttribute('href');
                const hash = this.#extractHash(href);

                this.#scrollTo(hash);
            });
        });
    }

    #extractHash(href)
    {
        const index = href.indexOf('#');

        if (index === -1) return null;

        return href.substring(index);
    }

    #scrollTo(hash)
    {
        const element = document.querySelector(hash);

        if (!element) return;

        this.#component.scrollTo(
        {
            top: element.offsetTop,
            behavior: 'smooth'
        });
    }
}

window.addEventListener('load', () => new ScrollComponent());
