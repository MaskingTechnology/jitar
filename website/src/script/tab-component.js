
class TabComponent
{
    #handles = null;
    #contents = null;

    constructor()
    {
        const component = document.querySelector('[tab-component]');
        this.#handles = [...component.querySelectorAll('[tab-handle]')];
        this.#contents = [...component.querySelectorAll('[tab-content]')];

        this.#addEventListeners();
    }

    #addEventListeners()
    {
        this.#handles.forEach(file =>
        {
            file.addEventListener('click', () =>
            {
                const id = file.getAttribute('tab-handle');
                
                this.#showContent(id);
            });
        });
    }

    #showContent(id)
    {
        this.#deselectHandles();
        this.#deselectContents();

        this.#selectHandle(id);
        this.#selectCodeBlock(id);
    }

    #deselectHandles()
    {
        this.#handles.forEach(file => file.classList.remove('selected'));
    }

    #deselectContents()
    {
        this.#contents.forEach(content => content.classList.remove('selected'));
    }

    #selectHandle(id)
    {
        const file = this.#handles.find(file => file.getAttribute('tab-handle') === id);
        file.classList.add('selected');
    }

    #selectCodeBlock(id)
    {
        const content = this.#contents.find(content => content.getAttribute('tab-content') === id);
        content.classList.add('selected');
    }
}

window.addEventListener('load', () => new TabComponent());
