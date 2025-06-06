import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatParagraph = (text) => {
   const specialHeaders = [
      "PRAYER",
      "CONFESSION",
      "DAILY SCRIPTURE READING",
      "FURTHER STUDY:",
      "RHAPSODY OF REALITIES DAILY DEVOTIONAL",
      "1 Year Bible Reading Plan",
      "2 Year Bible Reading Plan",
   ];

   const bibleReferenceRegex = /^\s*(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation|1 Year|2 Year)/;

   const trimmed = text.trim();

   if (specialHeaders.includes(trimmed.toUpperCase())) {
      return `<h4 class="font-bold text-purple-400 mt-6 mb-2">${trimmed}</h4>`;
   }

   if (bibleReferenceRegex.test(trimmed)) {
      return `<blockquote class="border-l-4 border-purple-500 pl-4 italic text-zinc-300">${trimmed}</blockquote>`;
   }

   const quoteMatch = trimmed.match(/"([^"]+)"/);
   if (quoteMatch) {
      const before = trimmed.slice(0, quoteMatch.index).trim();
      const quote = quoteMatch[1].trim();
      const after = trimmed.slice(quoteMatch.index + quote.length + 2).trim();

      let result = "";
      if (before) {
         let beforeFormatted = before.replace(/\b([A-Z]{2,})\b/g, "<strong>$1</strong>");
         result += `<p class="my-4">${beforeFormatted}</p>`;
      }

      result += `<blockquote class="border-l-4 border-purple-400 pl-4 italic text-zinc-300"><em>${quote}</em></blockquote>`;

      if (after) {
         let afterFormatted = after.replace(/\b([A-Z]{2,})\b/g, "<strong>$1</strong>");
         result += `<p class="my-4">${afterFormatted}</p>`;
      }

      return result;
   }

   let formatted = trimmed.replace(/\b([A-Z]{2,})\b/g, '<strong>$1</strong>');
   return `<p class="my-4">${formatted}</p>`;
};

const PostContent = ({ content }) => {
   const [expanded, setExpanded] = useState(false);
   const contentRef = useRef(null);

   if (!content) return null;

   const paragraphs = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

   const allWords = paragraphs.join(" ").split(" ");
   const previewWords = allWords.slice(0, 60).join(" ");
   const isTruncated = allWords.length > 60;

   const handleReadMore = () => {
      setExpanded(true);
      setTimeout(() => {
         contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100); // Wait for render
   };

   return (
      <div ref={ contentRef } className="mb-12">
         <AnimatePresence initial={ false }>
            { expanded ? (
               <motion.article
                  key="full"
                  initial={ { opacity: 0, y: 10 } }
                  animate={ { opacity: 1, y: 0 } }
                  exit={ { opacity: 0, y: -10 } }
                  transition={ { duration: 0.3 } }
                  className="prose prose-invert prose-zinc max-w-none"
               >
                  { paragraphs.map((para, i) => (
                     <div
                        key={ i }
                        dangerouslySetInnerHTML={ { __html: formatParagraph(para) } }
                     />
                  )) }
               </motion.article>
            ) : (
               <motion.article
                  key="preview"
                  initial={ { opacity: 0, y: 10 } }
                  animate={ { opacity: 1, y: 0 } }
                  exit={ { opacity: 0, y: -10 } }
                  transition={ { duration: 0.3 } }
                  className="prose prose-invert prose-zinc max-w-none"
               >
                  <div
                     dangerouslySetInnerHTML={ { __html: formatParagraph(previewWords + "...") } }
                  />
                  { isTruncated && (
                     <button
                        onClick={ handleReadMore }
                        className="mt-6 px-4 py-1.5 text-sm rounded bg-purple-600 text-white hover:bg-purple-700 transition"
                     >
                        Read More
                     </button>
                  ) }
               </motion.article>
            ) }
         </AnimatePresence>
      </div>
   );
};

export default PostContent;
