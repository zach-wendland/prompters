"""Core prompt refinement utilities.

This module purposely avoids any dependency on external AI services so that it
can be exercised in a fully offline environment (e.g. during unit tests).  The
original project shipped with a large Streamlit experience and direct calls to
OpenAI APIs.  Those features are not required for the kata-style exercises in
this repository, and they make local development unnecessarily fragile.  The
refactored module below keeps the ergonomic public surface area used by the
tests while providing a deterministic implementation that is easy to reason
about.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from enum import Enum
from typing import Iterable, List

_SANITIZE_PATTERN = re.compile(r"[`*#<>{}\\\[\]()\"'\\]")


class PromptRefinementAgent:
    """Create lightly sanitised, style-aware prompt directives.

    Only a tiny slice of the original feature set is required for the tests in
    this kata.  The class therefore focuses on three behaviours:

    * Surfacing the list of supported styles and validating user input.
    * Removing unsafe punctuation from raw prompt text.
    * Producing a deterministic refined prompt without external API calls.
    """

    class Style(str, Enum):
        """Enumeration of supported prompt styles."""

        INSTRUCTIONAL = "instructional"
        CONCISE = "concise"
        CREATIVE = "creative"
        TECHNICAL = "technical"
        PERSUASIVE = "persuasive"
        FORMAL = "formal"
        CASUAL = "casual"
        ANALYTICAL = "analytical"
        INTERROGATIVE = "interrogative"
        MILITANT = "militant"
        COMPLIANCE = "compliance"
        STEALTH = "stealth"
        REDTEAM = "redteam"

        @classmethod
        def all(cls) -> List[str]:
            """Return all style names as lower-case strings."""

            return [style.value for style in cls]

        @classmethod
        def validate(cls, value: str | None) -> bool:
            """Return ``True`` when *value* is the name of a supported style."""

            return isinstance(value, str) and value.lower() in cls._value2member_map_

    def __init__(self, *, default_context: str | None = None) -> None:
        self._default_context = default_context or "general"

    # ------------------------------------------------------------------
    # Helper utilities
    def _sanitize(self, text: str) -> str:
        """Remove risky punctuation so refined prompts stay deterministic."""

        if not isinstance(text, str):
            raise TypeError("text must be a string")
        cleaned = _SANITIZE_PATTERN.sub("", text)
        return cleaned.strip()

    def _build_header(self, style: "PromptRefinementAgent.Style", context: str) -> str:
        """Return a human-readable header describing the chosen style."""

        context_text = context.strip() or self._default_context
        return f"[{style.value.upper()} | context: {context_text}]"

    def _format_sections(self, sections: Iterable[str]) -> str:
        """Join non-empty sections with a single blank line."""

        filtered = [section.strip() for section in sections if section and section.strip()]
        return "\n\n".join(filtered)

    # ------------------------------------------------------------------
    # Public API
    def refine(self, raw: str, style: str, context: str = "") -> str:
        """Return a deterministic refined prompt.

        Parameters
        ----------
        raw:
            The unprocessed user prompt.
        style:
            Name of the desired writing style.  Must match :class:`Style`.
        context:
            Optional textual context to embed in the directive header.
        """

        if not self.Style.validate(style):
            raise ValueError(f"Invalid style: {style}")

        sanitized_prompt = self._sanitize(raw)
        chosen_style = self.Style(style.lower())
        header = self._build_header(chosen_style, context)

        body = sanitized_prompt or "(prompt removed during sanitisation)"
        guidance = (
            "Rewrite the prompt so it follows the requested style."
            " Keep critical instructions and discard noise."
        )

        return self._format_sections((header, guidance, body))


# ----------------------------------------------------------------------
# Optional convenience API
@dataclass(frozen=True)
class RefinedPrompt:
    """Simple container representing the result of a refinement operation."""

    header: str
    guidance: str
    body: str

    def __str__(self) -> str:  # pragma: no cover - trivial data representation
        return "\n\n".join(part for part in (self.header, self.guidance, self.body) if part)


def refine_prompt(raw: str, style: str, context: str = "") -> str:
    """Convenience function mirroring :meth:`PromptRefinementAgent.refine`."""

    agent = PromptRefinementAgent()
    return agent.refine(raw, style, context)
