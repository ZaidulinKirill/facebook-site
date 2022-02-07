export const pageVariables = {
  'Meta title': 'Editor',
  'Main form': [
    { type: 'form-input-field', name: 'First name', label: 'First name', variant: 'standard', xs: 12, md: 6, lg: 4, required: true },
    { type: 'form-input-field', name: 'Second name', label: 'Second name', variant: 'standard', xs: 12, md: 6, lg: 4 },
    { type: 'form-radio-field', name: 'Gender', label: 'Gender', row: true, xs: 12, lg: 4, items: [{ name: 'male', label: 'Male' }, { name: 'female', label: 'Female' }], default: 'male' },
    { type: 'form-textarea-field', name: 'Some words about yourself', label: 'Some words about yourself', variant: 'outlined', xs: 12, rowsCount: 3 },
    { type: 'form-select-field', name: 'Your question', label: 'Your question', xs: 12, md: 6, items: [{ name: 'Want to test the system', label: 'Want to test the system' }, { name: 'Want to finish a project', label: 'Want to finish a project' }], required: true },
    { type: 'form-audio-recorder', variant: 'contained', label: 'Voice checking', md: 3 },
    { type: 'form-checkbox-field', name: 'Allow us to store your data', label: 'Allow us to store your data', required: true, md: 12 },
    { type: 'form-submit-button', variant: 'contained', label: 'Send your question!', md: 12 },
  ],
  'Facebook link': 'https://vk.com',
  'Instagram link': 'https://vk.com',
  'Menu items': [
    { text: 'Home', href: '#home' },
    { text: 'Listen to radio show', href: '#listen' },
    { text: 'Top 35', href: '#top-35' },
    { text: 'Argisto is threating', href: '#video-list' },
  ],
  'Global styles': `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;500;600&display=swap');

    html {
      scroll-behavior: smooth;
    }
  `,
  'Video carousel items': [
    { name: 'Radio Agristo - part 1', video: 'https://player.vimeo.com/video/638648807?muted=0' },
    { name: 'Radio Agristo - part 2', video: 'https://player.vimeo.com/video/638671739?muted=0' },
    { name: 'Radio Agristo - part 3', video: 'https://player.vimeo.com/video/639532692?muted=0' },
    { name: 'Radio Agristo - part 4', video: 'https://player.vimeo.com/video/639070308?muted=0' },
    { name: 'Radio Agristo - part 5', video: 'https://player.vimeo.com/video/639106132?muted=0' },
    { name: 'Radio Agristo - part 6', video: 'https://player.vimeo.com/video/639125778?muted=0' },
    { name: 'Radio Agristo - part 7', video: 'https://player.vimeo.com/video/639149059?muted=0' },
    { name: 'Radio Agristo - part 8', video: 'https://player.vimeo.com/video/639170790?muted=0' },
    { name: 'Radio Agristo - part 9', video: 'https://player.vimeo.com/video/639186418?muted=0' },
  ],
  'Image carousel items': [
    { url: 'https://static.wixstatic.com/media/d0d063_b875d6f450d14838835c6aa8c0c4677c~mv2.jpg/v1/fit/w_1736,h_1718,q_90/d0d063_b875d6f450d14838835c6aa8c0c4677c~mv2.webp' },
    { url: 'https://static.wixstatic.com/media/d0d063_4eeba77a728842ea87e2e8c39c9505f7~mv2.jpg/v1/fit/w_1736,h_1718,q_90/d0d063_4eeba77a728842ea87e2e8c39c9505f7~mv2.webp' },
    { url: 'https://static.wixstatic.com/media/d0d063_aff27e1ef83e4519881a8c7df6229240~mv2.jpg/v1/fit/w_1736,h_1718,q_90/d0d063_aff27e1ef83e4519881a8c7df6229240~mv2.webp' },
    { url: 'https://static.wixstatic.com/media/d0d063_556f335e36b343d6968aff76e0d63243~mv2.jpg/v1/fit/w_1736,h_1718,q_90/d0d063_556f335e36b343d6968aff76e0d63243~mv2.webp' },
    { url: 'https://static.wixstatic.com/media/d0d063_20fdf08375a74141b4838893ab566392~mv2.jpg/v1/fit/w_1736,h_1718,q_90/d0d063_20fdf08375a74141b4838893ab566392~mv2.webp' },
    { url: 'https://static.wixstatic.com/media/d0d063_26de7300005440eeb2b8e4eb2ce5530d~mv2.jpg/v1/fit/w_1736,h_1718,q_90/d0d063_26de7300005440eeb2b8e4eb2ce5530d~mv2.webp' },
    { url: 'https://static.wixstatic.com/media/d0d063_98b3ac7d4c86470b8d700569758fcad9~mv2.jpg/v1/fit/w_1736,h_1536,q_90/d0d063_98b3ac7d4c86470b8d700569758fcad9~mv2.webp' },
  ],
  'Top 35 snippet': '<iframe src="https://open.spotify.com/embed?uri=spotify%3Aplaylist%3A31wPIDXWq3kyLHkkvQjzID" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>',
  'Banner image': 'remove me',
};
