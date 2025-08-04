import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingSocialMenu from '@/components/FloatingSocialMenu';

describe('FloatingSocialMenu', () => {
  it('deve renderizar o botão flutuante', () => {
    render(<FloatingSocialMenu />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('+');
  });

  it('deve abrir o menu quando o botão for clicado', () => {
    render(<FloatingSocialMenu />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(screen.getByText('Nossas Redes')).toBeInTheDocument();
    expect(button).toHaveTextContent('×');
  });

  it('deve fechar o menu quando o botão for clicado novamente', () => {
    render(<FloatingSocialMenu />);
    const button = screen.getByRole('button');
    
    // Abrir o menu
    fireEvent.click(button);
    expect(screen.getByText('Nossas Redes')).toBeInTheDocument();
    
    // Fechar o menu
    fireEvent.click(button);
    expect(screen.queryByText('Nossas Redes')).not.toBeInTheDocument();
    expect(button).toHaveTextContent('+');
  });

  it('deve renderizar todas as redes sociais quando o menu estiver aberto', () => {
    render(<FloatingSocialMenu />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Site')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('deve ter links corretos para as redes sociais', () => {
    render(<FloatingSocialMenu />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    const youtubeLink = screen.getByRole('link', { name: /youtube/i });
    const siteLink = screen.getByRole('link', { name: /site/i });
    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/futuretechbr/');
    expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/channel/UCWajNYhJCLLm6efWmUKOjNg');
    expect(siteLink).toHaveAttribute('href', 'https://future.com.br/');
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/futureonface');
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/futuretechnologiesbr');
  });

  it('deve ter target="_blank" e rel="noopener noreferrer" em todos os links', () => {
    render(<FloatingSocialMenu />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    const links = screen.getAllByRole('link');
    
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('deve não renderizar o menu inicialmente', () => {
    render(<FloatingSocialMenu />);
    
    expect(screen.queryByText('Nossas Redes')).not.toBeInTheDocument();
    expect(screen.queryByText('Instagram')).not.toBeInTheDocument();
  });
});

