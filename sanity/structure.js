const SINGLETONS = ['homeHero', 'about', 'resume', 'contactInfo'];

function createSingleton(S, typeName, title) {
  return S.listItem()
    .title(title)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
        .title(title)
    );
}

export const structure = (S) =>
  S.list()
    .title('Website Content')
    .items([
      createSingleton(S, 'homeHero', 'Home Hero'),
      createSingleton(S, 'about', 'About / Bio'),
      createSingleton(S, 'resume', 'Resume / CV'),
      createSingleton(S, 'contactInfo', 'Contact Info'),

      S.divider(),

      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('alsoBuildingEntry').title('Also Building'),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !SINGLETONS.includes(listItem.getId()) &&
          !['project', 'alsoBuildingEntry'].includes(listItem.getId())
      ),
    ]);
