const SocialShare = ({ match, analysis }) => {
  const [showShare, setShowShare] = useState(false);

  const shareData = {
    title: `${match.home} vs ${match.away}`,
    text: `AI Prediction: ${analysis?.prediction || "N/A"} - Confidence: ${
      analysis?.confidence || 0
    }%`,
    url: window.location.href,
  };

  const handleShare = async (platform) => {
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareData.text
        )}&url=${encodeURIComponent(shareData.url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareData.url
        )}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          shareData.text + " " + shareData.url
        )}`,
      };
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
    setShowShare(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    setShowShare(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {showShare && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShare(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-surface border border-primary/30 rounded-xl shadow-xl z-50 p-4">
            <h4 className="font-bold mb-3">Condividi Analisi</h4>
            <div className="space-y-2">
              {navigator.share && (
                <button
                  onClick={() => handleShare("native")}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-surface-light rounded-lg hover:bg-surface transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Condividi...</span>
                </button>
              )}
              <button
                onClick={() => handleShare("twitter")}
                className="w-full flex items-center gap-3 px-3 py-2 bg-surface-light rounded-lg hover:bg-surface transition-all"
              >
                <span>𝕏</span>
                <span>Twitter/X</span>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="w-full flex items-center gap-3 px-3 py-2 bg-surface-light rounded-lg hover:bg-surface transition-all"
              >
                <span>📘</span>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="w-full flex items-center gap-3 px-3 py-2 bg-surface-light rounded-lg hover:bg-surface transition-all"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 bg-surface-light rounded-lg hover:bg-surface transition-all"
              >
                <span>📋</span>
                <span>Copia Link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;
