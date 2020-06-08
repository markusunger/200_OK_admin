document.addEventListener('DOMContentLoaded', () => {
  // find all links inside the toc menu
  const tocLinks = [...document.querySelectorAll('ul.menu-list a')];
  let currentlyActive = null;
  let firstVisible = true;

  const observer = new IntersectionObserver((headings) => {
    headings.forEach((h) => {
      // for each heading in the document, get id and find toc links with
      // that anchor href
      const href = `#${h.target.getAttribute('id')}`;
      const tocLink = tocLinks.find(l => l.getAttribute('href') === href);

      if (h.isIntersecting && firstVisible) {
        // add active class to first visible heading on page, save reference
        // for when no links will be in viewport
        tocLink.classList.add('is-active');
        firstVisible = false;
        if (currentlyActive) currentlyActive.classList.remove('is-active');
        currentlyActive = tocLink;
      } else {
        tocLink.classList.remove('is-active');
      }
    });

    if (firstVisible && currentlyActive) {
      // if there was no visible link, make saved reference of last heading on page
      // the active link
      currentlyActive.classList.add('is-active');
      firstVisible = true;
    }

    firstVisible = true;
  }, {});

  const headings = [...document.querySelectorAll('h2, h3')];
  headings.forEach(h => observer.observe(h));
});
