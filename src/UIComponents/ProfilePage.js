// Assuming necessary components are exported from the uploaded files.
import { Button, Div, Input, Label, Text } from './UIComponent';

function generateProfilePage() {
    // Create the main profile page container
    const profilePage = Div({ id: 'profile-page', className: 'page' });

    // Add headings
    const heading1 = Text({ tag: 'h1', content: 'Welcome to Profile-Page' });
    const heading2 = Text({ tag: 'h1', content: 'Profile-Page' });
    profilePage.appendChild(heading1);
    profilePage.appendChild(heading2);

    // Create profile info section
    const profileInfo = Div({ id: 'profile-info' });

    // Profile picture
    const profilePic = Text({
        tag: 'img',
        attributes: {
            id: 'profile-pic',
            src: 'frontend_static/default_profile.png',
            alt: 'Profile Picture',
        },
    });
    profileInfo.appendChild(profilePic);

    // Upload section
    const uploadSection = Div({ className: 'upload-section' });
    const uploadInput = Input({
        type: 'url',
        id: 'upload-pic-url',
        placeholder: "Resim URL'si girin",
    });
    const confirmUploadButton = Button({
        id: 'confirm-upload',
        content: 'Onayla',
    });
    uploadSection.appendChild(uploadInput);
    uploadSection.appendChild(confirmUploadButton);
    profileInfo.appendChild(uploadSection);

    // Username and email
    const usernameText = Text({
        tag: 'p',
        content: '<strong>Username:</strong> <span id="username"></span>',
    });
    const emailText = Text({
        tag: 'p',
        content: '<strong>Email:</strong> <span id="email"></span>',
    });
    profileInfo.appendChild(usernameText);
    profileInfo.appendChild(emailText);

    // Bio section
    const bioSection = Div({ className: 'bio-section' });
    const bioHeading = Text({ tag: 'h3', content: 'Hakkımda' });
    const bioTextarea = Text({
        tag: 'textarea',
        attributes: {
            id: 'bio-text',
            placeholder: 'Kendiniz hakkında kısa bir açıklama girin...',
        },
    });
    const saveBioButton = Button({
        id: 'save-bio',
        content: 'Kaydet',
    });
    bioSection.appendChild(bioHeading);
    bioSection.appendChild(bioTextarea);
    bioSection.appendChild(saveBioButton);
    profileInfo.appendChild(bioSection);

    profilePage.appendChild(profileInfo);

    // Toggle switch and QR button
    const toggleContainer = Div();
    const toggleLabel = Label({
        className: 'switch',
        content: '<input type="checkbox" id="twoFactor"><span class="slider"></span>',
    });
    const toggleText = Text({ tag: 'span', content: 'On / Off' });
    const showQRButton = Button({
        id: 'show-qr',
        content: 'SHOW-QR',
    });
    toggleContainer.appendChild(toggleLabel);
    toggleContainer.appendChild(toggleText);
    toggleContainer.appendChild(showQRButton);

    profilePage.appendChild(toggleContainer);

    // Navigation buttons
    const logoutButton = Button({ id: 'logout-button', content: 'Logout' });
    const homeButton = Button({ id: 'home-button', content: 'Home' });
    const dashboardButton = Button({ id: 'dashboard-button', content: 'DashBoard' });
    const profileButton = Button({ id: 'my-profile-button', content: 'Profile' });
    profilePage.appendChild(logoutButton);
    profilePage.appendChild(homeButton);
    profilePage.appendChild(dashboardButton);
    profilePage.appendChild(profileButton);

    return profilePage;
}

export default generateProfilePage;