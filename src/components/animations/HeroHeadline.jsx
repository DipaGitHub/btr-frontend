import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../utils/apiConfig'

const DEFAULT_BANNER = {
  title: 'Helping businesses turn',
  subtitles: [
    { subtitle: 'ideas into impact.', description: 'We create digital experiences that make ambitious brands easier to find, easier to trust, and impossible to forget.' },
    { subtitle: 'visions to reality.', description: 'We create digital experiences that make ambitious brands easier to find, easier to trust, and impossible to forget.' },
    { subtitle: 'digital into growth.', description: 'We create digital experiences that make ambitious brands easier to find, easier to trust, and impossible to forget.' },
  ]
};

/**
 * Hero headline with animated rotating phrase.
 * Cycles through Banners (Title 1) and their Subtitles (Title 2 + Description).
 */
export function HeroHeadline({ onDescriptionChange }) {
  const [banners, setBanners] = useState([DEFAULT_BANNER])
  const [bannerIdx, setBannerIdx] = useState(0)
  const [subtitleIdx, setSubtitleIdx] = useState(0)

  useEffect(() => {
    // Fetch dynamic banners from the API
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/banners`)
        const json = await res.json()
        if (json.data && json.data.length > 0) {
          const formattedBanners = json.data.map(b => {
            let parsedSubtitles = [];
            try {
                parsedSubtitles = b.subtitles ? JSON.parse(b.subtitles) : [];
            } catch(e) {}
            return {
                title: b.title,
                subtitles: parsedSubtitles.length > 0 ? parsedSubtitles : [{ subtitle: '', description: '' }]
            };
          });
          
          if (formattedBanners.length > 0) {
            setBanners(formattedBanners)
            setBannerIdx(0)
            setSubtitleIdx(0)
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic phrases for hero headline:', err)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    const currentBanner = banners[bannerIdx] || DEFAULT_BANNER;
    const currentSubtitle = currentBanner.subtitles[subtitleIdx];
    
    // Notify parent about the description change
    if (onDescriptionChange && currentSubtitle && currentSubtitle.description) {
        onDescriptionChange(currentSubtitle.description);
    }
  }, [bannerIdx, subtitleIdx, banners, onDescriptionChange])

  useEffect(() => {
    const id = setInterval(() => {
        setSubtitleIdx(prevSubIdx => {
            const currentBanner = banners[bannerIdx];
            const nextSubIdx = prevSubIdx + 1;
            
            // If we reached the end of the current banner's subtitles
            if (nextSubIdx >= currentBanner.subtitles.length) {
                // Move to next banner
                setBannerIdx(prevBanIdx => (prevBanIdx + 1) % banners.length);
                return 0; // Reset subtitle index to 0 for the new banner
            }
            
            return nextSubIdx;
        });
    }, 3500)
    
    return () => clearInterval(id)
  }, [bannerIdx, banners])

  const currentBanner = banners[bannerIdx] || DEFAULT_BANNER;
  const currentSubtitleText = currentBanner.subtitles[subtitleIdx]?.subtitle || '';

  return (
    <h1>
      {currentBanner.title}{' '}
      {currentSubtitleText && (
          <span className="hero-phrase-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.em
                key={`${bannerIdx}-${subtitleIdx}`}
                initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -22, filter: 'blur(4px)' }}
                transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block' }}
              >
                {currentSubtitleText}
              </motion.em>
            </AnimatePresence>
          </span>
      )}
    </h1>
  )
}
