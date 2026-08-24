document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');

    if (!gridContainer || !Array.isArray(navData)) {
        return;
    }

    const fragment = document.createDocumentFragment();

    navData.forEach(category => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const title = document.createElement('h2');
        title.textContent = category.title;

        const linkContainer = document.createElement('div');
        linkContainer.className = 'link-container';

        category.links.forEach(link => {
            const linkBlock = document.createElement('div');
            linkBlock.className = 'link-block';

            const anchor = document.createElement('a');

            anchor.href = link.url;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = link.name;

            if (link.icon) {
                const icon = document.createElement('img');

                icon.src = link.icon;
                icon.alt = `${link.name}图标`;
                icon.onerror = () => {
                    icon.style.display = 'none';
                };

                anchor.prepend(icon);
            }

            linkBlock.appendChild(anchor);
            linkContainer.appendChild(linkBlock);
        });

        gridItem.appendChild(title);
        gridItem.appendChild(linkContainer);
        fragment.appendChild(gridItem);
    });

    gridContainer.appendChild(fragment);
});