import pytest
from pages.core.prompt_agent import PromptRefinementAgent

def test_valid_styles():
    agent = PromptRefinementAgent()
    for style in agent.Style.all():
        assert agent.Style.validate(style) is True

def test_invalid_style_throws():
    agent = PromptRefinementAgent()
    with pytest.raises(ValueError):
        agent.refine("hello", "kawaii", "Just test it")

def test_sanitize_input_removes_junk():
    agent = PromptRefinementAgent()
    dirty = "`DROP TABLE * FROM SYSTEM; <script>alert('x')</script>`"
    clean = agent._sanitize(dirty)
    assert "<" not in clean and "`" not in clean and "*" not in clean
