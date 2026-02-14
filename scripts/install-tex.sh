# borrowed from https://algrt.hm/2024-07-22-latex-on-macos/ (plus some tweaks)
# brew
brew install basictex

# reload path
eval "$(/usr/libexec/path_helper)"

# tex bits
sudo tlmgr update --self
sudo tlmgr install \
    texliveonfly \
    adjustbox \
    tcolorbox \
    collectbox \
    ucs \
    environ \
    trimspaces \
    titling \
    enumitem \
    rsfs \
    moderncv \
    ctex
