import facebookSvg from "../../assets/facebook-svgrepo.svg";
import twitterSvg from "../../assets/twitter-svgrepo.svg";
import linkedinSvg from "../../assets/linkedin-svgrepo.svg";
import whatsappSvg from "../../assets/whatsapp-svgrepo.svg";

const useShareSocial = () => {
  const socialMediaShareMessage = ref([
    "I just found this awesome tool that saves time with reading and writing. It's helped thousands already. Check it out! 😍",
    "This extension has completely changed the way I read online. It's a game-changer for thousands of users. You've got to see this! 😍",
    "Hey, I came across this cool extension that makes reading and writing so much easier. It's a favorite among thousands! Thought you might like it too! 😍",
    "You're going to love this! It's an extension that helps you understand complex text easily, used by thousands. It's like having GPT at your fingertips 😍",
    "Found something cool that I know you'll appreciate. It's an extension that simplifies, summarizes, and does all sorts of things with text. Thousands are loving it. Give it a try 😍",
    "I came across this Chrome extension, and it's like magic for reading! Used and loved by thousands. I know you'll find it useful too. 😍",
    "Just stumbled upon this reading assistant tool. It's like it reads my mind and knows exactly what I need from a text. A hit with thousands of users. 😍",
    "Imagine having a tool that can summarize or expand any text online. Well, I found it! Loved by thousands, and I think you'll love it as much as I do. 😍",
  ]);

  const socialMediaContents = ref([
    {
      type: "facebook",
      icon: facebookSvg,
    },
    {
      type: "twitter",
      icon: twitterSvg,
    },
    {
      type: "linkedin",
      icon: linkedinSvg,
    },
    {
      type: "whatsapp",
      icon: whatsappSvg,
    },
  ]);

  const shareToSocialMedia = (platform: string, content?: any = {}) => {
    const url = encodeURIComponent(content.url || "https://respondbuddy.com");
    const text = encodeURIComponent(
      content.text ||
        getRandomItem(socialMediaShareMessage.value) ||
        "I just found this awesome tool that saves time with reading and writing. Check it out!"
    );

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      // Add more cases for other platforms if needed
      default:
        console.warn("Unknown platform:", platform);
        return;
    }

    // Open the share URL in a new window
    window.open(shareUrl, "_blank");
  };

  const getRandomItem = (arr: []) => {
    if (!arr.length) {
      return null; // Return null if the array is empty
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  return {
    shareToSocialMedia,
    getRandomItem,
    socialMediaContents,
    socialMediaShareMessage,
  };
};

export default useShareSocial;
