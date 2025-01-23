import { useApi } from "../src/api/Api.js";

export async function profilePage() {

  const api = useApi();

  let user_data;
  try {
    user_data = await api.getProfile();
  } catch ( error ) {
    console.log( error );
    return ``;
  }

  const username = user_data.username;
  const email = user_data.email;
  const isActiveTwoFactor = user_data.isActiveTwoFactor;
  const profile_picture = user_data.profile_picture;

  const profilePage = Div( { className: 'profile-page' } );

  // Add headings
  const heading1 = Text( { tag: 'h1', content: 'Welcome to Profile-Page' } );
  const heading2 = Text( { tag: 'h1', content: 'Profile-Page' } );
  profilePage.appendChild( heading1 );
  profilePage.appendChild( heading2 );

  // Create profile info section
  const profileInfo = Div( { id: 'profile-info' } );

  // Profile picture
  const profilePic = Text( {
    tag: 'img',
    attributes: {
      id: 'profile-pic',
      src: 'https://fastly.picsum.photos/id/546/1024/1024.jpg?hmac=Hf8Ch7XeRlgNNfVuAKzIOkJMMNFTjNXcUnb5kdCJWoc',
      alt: 'Profile Picture',
    },
  } );
  profileInfo.appendChild( profilePic );

  // Upload section
  const uploadSection = Div( { className: 'upload-section' } );
  const uploadInput = Input( {
    type: 'url',
    id: 'upload-pic-url',
    placeholder: "Resim URL'si girin",
  } );
  const confirmUploadButton = Button( {
    id: 'confirm-upload',
    content: 'Onayla',
  } );
  uploadSection.appendChild( uploadInput );
  uploadSection.appendChild( confirmUploadButton );
  profileInfo.appendChild( uploadSection );

  // Username and email
  const usernameText = Text( {
    tag: 'p',
    content: '<strong>Username:</strong> <span id="username"></span>',
  } );
  const emailText = Text( {
    tag: 'p',
    content: '<strong>Email:</strong> <span id="email"></span>',
  } );
  profileInfo.appendChild( usernameText );
  profileInfo.appendChild( emailText );

  // Bio section
  const bioSection = Div( { className: 'bio-section' } );
  const bioHeading = Text( { tag: 'h3', content: 'Hakkımda' } );
  const bioTextarea = Text( {
    tag: 'textarea',
    attributes: {
      id: 'bio-text',
      placeholder: 'Kendiniz hakkında kısa bir açıklama girin...',
    },
  } );
  const saveBioButton = Button( {
    id: 'save-bio',
    content: 'Kaydet',
  } );
  bioSection.appendChild( bioHeading );
  bioSection.appendChild( bioTextarea );
  bioSection.appendChild( saveBioButton );
  profileInfo.appendChild( bioSection );

  profilePage.appendChild( profileInfo );

  return profilePage;
}


function Div( { className } ) {
  const div = document.createElement( 'div' );
  div.className = className;
  return div;
}

function Input( { className, type, id, placeholder } ) {
  const input = document.createElement( 'input' );
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  input.className = className;
  return input;
}

function Button( { id, content, className } ) {
  const button = document.createElement( 'button' );
  button.id = id;
  button.textContent = content;
  button.className = className;
  return button;
}

function Text( { tag, content, attributes } ) {
  const text = document.createElement( tag );
  text.innerHTML = content;
  if ( attributes ) {
    for ( const key in attributes ) {
      text.setAttribute( key, attributes[key] );
    }
  }
  return text;
}