from django.db.models import Prefetch, Case, When, IntegerField
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, Image, KeepTogether, HRFlowable, Frame, PageTemplate
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from django.core.files.base import ContentFile
from datetime import datetime
from decimal import Decimal
import matplotlib.pyplot as plt
import io
import numpy as np

# ==============================================
# CONFIGURAÇÕES DE ESTILO E CORES
# ==============================================

# Paleta de cores moderna e profissional
COLORS = {
    'primary': {
        'dark': '#2c3e50',
        'main': '#3498db',
        'light': '#ecf0f1'
    },
    'secondary': {
        'dark': '#7f8c8d',
        'main': '#95a5a6',
        'light': '#bdc3c7'
    },
    'accent': {
        'orange': '#e67e22',
        'green': '#2ecc71',
        'red': '#e74c3c'
    },
    'text': {
        'dark': '#2c3e50',
        'medium': '#34495e',
        'light': '#7f8c8d'
    },
    'background': {
        'light': '#f9f9f9',
        'lighter': '#ffffff'
    }
}

def hex_to_color(hex_code):
    """Converts hex code to Color object, handles both string and Color inputs"""
    if isinstance(hex_code, colors.Color):
        return hex_code
    if isinstance(hex_code, str):
        if hex_code.startswith('#'):
            return colors.HexColor(hex_code)
        return colors.HexColor('#' + hex_code.lstrip('#'))
    raise ValueError(f"Expected hex string or Color object, got {type(hex_code)}")

# ==============================================
# FUNÇÕES AUXILIARES
# ==============================================

def calcular_status(media, objetivo):
    """Determina o status com base na média e objetivo."""
    if media is None or objetivo is None:
        return "N/A"
        
    try:
        media = Decimal(str(media))
        objetivo = Decimal(str(objetivo))
    except:
        return "Erro"
    
    if objetivo <= Decimal(0):
        return "Excelente" if media > Decimal(0) else "Crítico"

    percentual = media / objetivo

    if percentual >= Decimal("1.2"):
        return "Excelente"
    elif percentual >= Decimal("0.9"):
        return "Bom"
    elif percentual >= Decimal("0.7"):
        return "Regular"
    elif percentual >= Decimal("0.5"):
        return "Atenção"
    return "Crítico"

def status_color(status):
    """Retorna a cor baseada no status"""
    status = status.lower()
    if 'excelente' in status:
        return COLORS['accent']['green']
    elif 'bom' in status:
        return '#27ae60'
    elif 'regular' in status:
        return COLORS['accent']['orange']
    elif 'atenção' in status:
        return '#f39c12'
    elif 'crítico' in status:
        return COLORS['accent']['red']
    return COLORS['secondary']['main']

# ==============================================
# FUNÇÕES DE GRÁFICOS
# ==============================================

def generate_radar_chart(subcategories_data, title):
    """Gera gráfico radar para subcategorias"""
    labels = [sub['nome'] for sub in subcategories_data]
    values = [float(sub['media_total']) for sub in subcategories_data]
    num_vars = len(labels)
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    ax.plot(angles, values, color=COLORS['primary']['main'], linewidth=2)
    ax.fill(angles, values, color=COLORS['primary']['main'], alpha=0.25)
    
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)
    ax.set_thetagrids(np.degrees(angles[:-1]), labels)
    ax.set_ylim(0, 5)
    ax.set_yticks([1, 2, 3, 4, 5])
    ax.set_title(title, pad=20, fontsize=14, color=COLORS['text']['dark'])
    
    plt.tight_layout()
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=150, transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

def generate_maturity_chart(functions_data):
    """Gera gráfico de barras comparando política vs prática"""
    function_names = [f.nome for f in functions_data]
    politica_data = [float(f.media_politica) for f in functions_data]
    pratica_data = [float(f.media_pratica) for f in functions_data]
    
    function_names.reverse()
    politica_data.reverse()
    pratica_data.reverse()
    
    fig, ax = plt.subplots(figsize=(10, 6))
    y = np.arange(len(function_names))
    bar_height = 0.35
    
    bars_politica = ax.barh(y - bar_height/2, politica_data, bar_height,
                          label='Política', color=COLORS['primary']['dark'])
    bars_pratica = ax.barh(y + bar_height/2, pratica_data, bar_height,
                         label='Prática', color=COLORS['primary']['main'])
    
    ax.set_xlabel('Nível de Maturidade', fontsize=10)
    ax.set_title('Maturidade por Função - Política vs Prática', 
                fontsize=14, pad=20, weight='bold')
    ax.set_yticks(y)
    ax.set_yticklabels(function_names)
    ax.set_xlim(0, 5)
    
    for bars in [bars_politica, bars_pratica]:
        for bar in bars:
            width = bar.get_width()
            ax.text(width + 0.05, bar.get_y() + bar.get_height()/2,
                   f'{width:.1f}', va='center', ha='left', fontsize=8)
    
    ax.axvline(x=3.0, color=COLORS['accent']['orange'], linestyle='--', linewidth=1)
    ax.text(3.05, len(function_names)-0.5, 'Objetivo (3.0)', 
           color=COLORS['accent']['orange'], fontsize=8)
    
    ax.legend(loc='lower right')
    plt.tight_layout()
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=120, transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

# ==============================================
# CONFIGURAÇÃO DO PDF
# ==============================================

def register_fonts():
    """Registra fontes personalizadas"""
    try:
        pdfmetrics.registerFont(TTFont('Roboto', 'Roboto-Regular.ttf'))
        pdfmetrics.registerFont(TTFont('Roboto-Bold', 'Roboto-Bold.ttf'))
        
        return 'Roboto', 'Roboto-Bold'
    except:
        return 'Helvetica', 'Helvetica-Bold'

def create_styles(font_name, bold_font_name):
    """Cria estilos para o documento"""
    styles = getSampleStyleSheet()  
    font_name, bold_font_name = register_fonts()
    DEFAULT_FONT = font_name
    # Estilo de capa
    styles.add(ParagraphStyle(
        name='CoverTitle',
        fontSize=24,
        leading=28,
        alignment=TA_CENTER,
        textColor=hex_to_color(COLORS['primary']['dark']),
        spaceAfter=20,
        fontName=bold_font_name
    ))
    
    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        fontSize=16,
        leading=20,
        alignment=TA_CENTER,
        textColor=hex_to_color(COLORS['text']['medium']),
        spaceAfter=30,
        fontName=font_name
    ))
    
    # Estilos de cabeçalho
    for level, size, leading, color in [
        ('Header1', 18, 22, COLORS['primary']['dark']),
        ('Header2', 16, 20, COLORS['accent']['orange']),
        ('Header3', 14, 18, COLORS['text']['medium'])
    ]:
        styles.add(ParagraphStyle(
            name=level,
            fontSize=size,
            leading=leading,
            alignment=TA_LEFT,
            textColor=hex_to_color(color),
            spaceBefore=15 if level == 'Header1' else 10,
            spaceAfter=8,
            fontName=bold_font_name
        ))
    
    # Estilos de conteúdo
    styles.add(ParagraphStyle(
        name='Question',
        fontSize=11,
        leading=14,
        alignment=TA_LEFT,
        textColor=hex_to_color(COLORS['text']['dark']),
        spaceAfter=6,
        fontName=bold_font_name
    ))
    
    styles.add(ParagraphStyle(
        name='Answer',
        fontSize=10,
        leading=13,
        alignment=TA_JUSTIFY,
        textColor=hex_to_color(COLORS['text']['medium']),
        spaceAfter=10,
        fontName=font_name
    ))
    
    # Estilos para tabelas
    styles.add(ParagraphStyle(
        name='TableHeader',
        fontSize=10,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.white,
        fontName=bold_font_name
    ))
    
    styles.add(ParagraphStyle(
        name='TableCell',
        fontSize=9,
        leading=11,
        alignment=TA_CENTER,
        textColor=hex_to_color(COLORS['text']['dark']),
        fontName=font_name
    ))
    
    # Estilos para recomendações
    styles.add(ParagraphStyle(
        name='RecommendationTitle',
        fontSize=12,
        leading=15,
        alignment=TA_LEFT,
        textColor=hex_to_color(COLORS['accent']['orange']),
        spaceBefore=10,
        spaceAfter=4,
        fontName=bold_font_name
    ))
    
    styles.add(ParagraphStyle(
        name='RecommendationMeta',
        fontSize=9,
        leading=11,
        alignment=TA_LEFT,
        textColor=hex_to_color(COLORS['text']['medium']),
        spaceAfter=2,
        fontName=font_name
    ))
    
    styles.add(ParagraphStyle(
        name='RecommendationDetail',
        parent=styles['Normal'],
        fontSize=10,
        leading=13,
        alignment=TA_JUSTIFY,
        textColor=colors.black,
        leftIndent=0,
        spaceAfter=4,
        fontName=DEFAULT_FONT
    ))

    return styles

# ==============================================
# FUNÇÃO PRINCIPAL
# ==============================================

def generate_pdf_report(formulario_respondido_id, logo_path=None):
    """Gera relatório PDF completo"""
    from form.models import FormularioRespondido, Resposta
    from maturity_assessment.models import MaturityAssessment, CategoriaMaturity, SubcategoriaMaturity
    from recomendacoes.models import Recomendacao

    # Buscar dados
    formulario = FormularioRespondido.objects.select_related(
        'cliente', 'formulario', 'responsavel'
    ).prefetch_related(
        Prefetch('respostas', queryset=Resposta.objects.select_related('pergunta', 'usuario')),
        Prefetch('maturity_assessment__categorias_maturity',
                queryset=CategoriaMaturity.objects.prefetch_related(
                    Prefetch('subcategorias_maturity',
                            queryset=SubcategoriaMaturity.objects.select_related('pergunta'))
                )
        ),
        Prefetch('recomendacoes_formulario', queryset=Recomendacao.objects.all())
    ).get(id=formulario_respondido_id)

    # Configurar documento
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=15*mm,
        leftMargin=15*mm,
        topMargin=20*mm,
        bottomMargin=20*mm,
        title=f"Relatório NIST CSF - {formulario.formulario.nome}"
    )

    # Configurar fontes
    font_name, bold_font_name = register_fonts()
    
    # Criar estilos
    styles = create_styles(font_name, bold_font_name)
    
    # Função para rodapé
    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont(font_name, 8)
        canvas.setFillColor(hex_to_color(COLORS['secondary']['main']))
        
        # Linha do rodapé
        canvas.line(doc.leftMargin, 15*mm, doc.width + doc.leftMargin, 15*mm)
        
        # Textos
        canvas.drawString(doc.leftMargin, 10*mm, 
                         f"Relatório gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        canvas.drawRightString(doc.width + doc.leftMargin, 10*mm, 
                             f"Página {doc.page}")
        canvas.restoreState()

    # Elementos do documento
    elements = []

    # ==============================================
    # CAPA
    # ==============================================
    if logo_path:
        try:
            logo = Image(logo_path, width=4*inch, height=2*inch)
            logo.hAlign = 'CENTER'
            elements.append(Spacer(1, 2*inch))
            elements.append(logo)
            elements.append(Spacer(1, 0.5*inch))
        except:
            elements.append(Spacer(1, 2*inch))

    elements.append(Paragraph("Relatório de Maturidade NIST CSF", styles['CoverTitle']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(formulario.formulario.nome, styles['CoverSubtitle']))
    elements.append(Spacer(1, 1.5*inch))

    # Informações do cliente
    client_data = [
        [Paragraph("<b>Cliente:</b>", styles['Normal']), Paragraph(formulario.cliente.get_full_name() or formulario.cliente.nome, styles['Normal'])],
        [Paragraph("<b>Analista:</b>", styles['Normal']), Paragraph(formulario.responsavel.get_full_name() or formulario.responsavel.nome, styles['Normal'])],
        [Paragraph("<b>Data:</b>", styles['Normal']), Paragraph(formulario.atualizado_em.strftime("%d/%m/%Y %H:%M"), styles['Normal'])],
    ]

    client_table = Table(client_data, colWidths=[1.5*inch, 4*inch])
    client_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), hex_to_color(COLORS['background']['light'])),
        ('TEXTCOLOR', (0, 0), (-1, -1), hex_to_color(COLORS['text']['dark'])),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, hex_to_color(COLORS['secondary']['light'])),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(client_table)
    elements.append(PageBreak())

    # ==============================================
    # SUMÁRIO
    # ==============================================
    elements.append(Paragraph("Sumário", styles['Header1']))
    elements.append(Spacer(1, 0.25*inch))

    # Ordenar funções conforme especificado
    functions = formulario.maturity_assessment.categorias_maturity.filter(tipo="FUNCAO").order_by(
        Case(
            When(sigla__endswith='GV', then=0),
            When(sigla__endswith='ID', then=1),
            When(sigla__endswith='PR', then=2),
            When(sigla__endswith='DE', then=3),
            When(sigla__endswith='RS', then=4),
            When(sigla__endswith='RC', then=5),
            default=6,
            output_field=IntegerField()
        )
    )

    toc = []
    toc.append(("1. Resumo Executivo", 1))

    for i, func in enumerate(functions, start=2):
        toc.append((f"{i}. {func.nome} ({func.sigla})", 1))
        categories_for_function = formulario.maturity_assessment.categorias_maturity.filter(
            tipo="CATEGORIA",
            sigla__startswith=f"{func.sigla}."
        ).order_by('sigla')
        
        for j, cat_func in enumerate(categories_for_function, start=1):
            toc.append((f"{i}.{j} {cat_func.nome}", 2))

    toc.append((f"{len(functions)+2}. Recomendações", 1))
    toc.append((f"{len(functions)+3}. Observações e Pendências", 1))

    for item_text, item_level in toc:
        if item_level == 1:
            elements.append(Paragraph(item_text, styles['Header2']))
        else:
            elements.append(Paragraph(f"  {item_text}", styles['Normal']))
        elements.append(HRFlowable(width="100%", thickness=0.5, 
                                 color=hex_to_color(COLORS['secondary']['light']), 
                                 spaceBefore=3, spaceAfter=3))

    elements.append(PageBreak())

    # ==============================================
    # RESUMO EXECUTIVO
    # ==============================================
    elements.append(Paragraph("1. Resumo Executivo", styles['Header1']))
    elements.append(Spacer(1, 0.25*inch))

    # Gráfico de maturidade
    if functions.exists():
        chart_buffer = generate_maturity_chart(functions)
        chart_image = Image(chart_buffer, width=6*inch, height=4*inch)
        chart_image.hAlign = 'CENTER'
        elements.append(chart_image)
        elements.append(Spacer(1, 0.5*inch))
    else:
        elements.append(Paragraph("Não há dados de função para gerar o gráfico.", styles['Answer']))
        elements.append(Spacer(1, 0.25*inch))

    # Tabela de resumo
    summary_data = [[
        Paragraph("Função", styles['TableHeader']),
        Paragraph("Média Política", styles['TableHeader']),
        Paragraph("Média Prática", styles['TableHeader']),
        Paragraph("Média Total", styles['TableHeader']),
        Paragraph("Status", styles['TableHeader'])
    ]]
    
    for func in functions:
        status = calcular_status(func.media_total, func.objetivo)
        summary_data.append([
            Paragraph(f"{func.nome} ({func.sigla})", styles['TableCell']),
            Paragraph(f"{func.media_politica:.1f}", styles['TableCell']),
            Paragraph(f"{func.media_pratica:.1f}", styles['TableCell']),
            Paragraph(f"{func.media_total:.1f}", styles['TableCell']),
            Paragraph(status, styles['TableCell'])
        ])

    if hasattr(formulario.maturity_assessment, 'media_total_geral'):
        status_geral = calcular_status(formulario.maturity_assessment.media_total_geral, Decimal('3.0'))
        summary_data.append([
            Paragraph("<b>TOTAL GERAL</b>", styles['TableCell']),
            Paragraph(f"<b>{formulario.maturity_assessment.media_total_politica:.1f}</b>", styles['TableCell']),
            Paragraph(f"<b>{formulario.maturity_assessment.media_total_pratica:.1f}</b>", styles['TableCell']),
            Paragraph(f"<b>{formulario.maturity_assessment.media_total_geral:.1f}</b>", styles['TableCell']),
            Paragraph(f"<b>{status_geral}</b>", styles['TableCell'])
        ])

    summary_table = Table(summary_data, colWidths=[2.5*inch, 1*inch, 1*inch, 1*inch, 1*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), hex_to_color(COLORS['primary']['dark'])),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), bold_font_name),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -2), hex_to_color(COLORS['background']['light'])),
        ('BACKGROUND', (0, -1), (-1, -1), hex_to_color(COLORS['primary']['main'])),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, hex_to_color(COLORS['secondary']['light'])),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    # Adicionar cores de status dinâmicas
    for i in range(1, len(summary_data)):
        status = summary_data[i][4].text
        bg_color = status_color(status)
        summary_table.setStyle(TableStyle([
            ('TEXTCOLOR', (4, i), (4, i), hex_to_color(bg_color if 'Excelente' in status or 'Bom' in status else colors.white)),
            ('BACKGROUND', (4, i), (4, i), hex_to_color(bg_color))
        ]))

    elements.append(summary_table)
    elements.append(Spacer(1, 0.5*inch))

    # ==============================================
    # SEÇÕES POR FUNÇÃO
    # ==============================================
    current_section_num = 2
    for func_item in functions:
        section_title = f"{current_section_num}. {func_item.nome} ({func_item.sigla})"
        elements.append(Paragraph(section_title, styles['Header1']))
        elements.append(Spacer(1, 0.25*inch))
        
        # Gráfico radar para subcategorias
        subcategories_data = []
        categories_in_function = formulario.maturity_assessment.categorias_maturity.filter(
            tipo="CATEGORIA",
            sigla__startswith=f"{func_item.sigla}."
        ).order_by('sigla')
        
        for cat in categories_in_function:
            subcategories_data.append({
                'nome': cat.nome,
                'media_total': cat.media_total
            })
        
        if subcategories_data:
            radar_chart_buffer = generate_radar_chart(subcategories_data, f"Subcategorias de {func_item.nome}")
            radar_image = Image(radar_chart_buffer, width=6*inch, height=6*inch)
            radar_image.hAlign = 'CENTER'
            elements.append(radar_image)
            elements.append(Spacer(1, 0.5*inch))

        # Resumo da função
        func_summary_data = [
            [Paragraph("<b>Média Política:</b>", styles['Normal']), Paragraph(f"{func_item.media_politica:.1f}", styles['Normal'])],
            [Paragraph("<b>Média Prática:</b>", styles['Normal']), Paragraph(f"{func_item.media_pratica:.1f}", styles['Normal'])],
            [Paragraph("<b>Média Total:</b>", styles['Normal']), Paragraph(f"{func_item.media_total:.1f}", styles['Normal'])],
            [Paragraph("<b>Status:</b>", styles['Normal']), Paragraph(func_item.status, styles['Normal'])],
            [Paragraph("<b>Objetivo:</b>", styles['Normal']), Paragraph(f"{func_item.objetivo:.1f}", styles['Normal'])],
        ]
        
        func_summary_table = Table(func_summary_data, colWidths=[1.5*inch, 4.5*inch])
        func_summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), hex_to_color(COLORS['background']['light'])),
            ('TEXTCOLOR', (0, 0), (-1, -1), hex_to_color(COLORS['text']['dark'])),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, hex_to_color(COLORS['secondary']['light'])),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        
        elements.append(func_summary_table)
        elements.append(Spacer(1, 0.5*inch))

        # Seções por categoria
        current_category_num = 1
        for cat_item in categories_in_function:
            category_title = f"{current_section_num}.{current_category_num} {cat_item.nome}"
            elements.append(Paragraph(category_title, styles['Header2']))
            elements.append(Spacer(1, 0.2*inch))

            # Resumo da categoria
            cat_summary_data = [
                [Paragraph("<b>Média Política:</b>", styles['Normal']), Paragraph(f"{cat_item.media_politica:.1f}", styles['Normal'])],
                [Paragraph("<b>Média Prática:</b>", styles['Normal']), Paragraph(f"{cat_item.media_pratica:.1f}", styles['Normal'])],
                [Paragraph("<b>Média Total:</b>", styles['Normal']), Paragraph(f"{cat_item.media_total:.1f}", styles['Normal'])],
                [Paragraph("<b>Status:</b>", styles['Normal']), Paragraph(cat_item.status, styles['Normal'])],
            ]
            
            cat_summary_table = Table(cat_summary_data, colWidths=[1.5*inch, 4.5*inch])
            cat_summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), hex_to_color(COLORS['background']['light'])),
                ('TEXTCOLOR', (0, 0), (-1, -1), hex_to_color(COLORS['text']['dark'])),
                ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
                ('ALIGN', (1, 0), (1, -1), 'LEFT'),
                ('GRID', (0, 0), (-1, -1), 0.5, hex_to_color(COLORS['secondary']['light'])),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('PADDING', (0, 0), (-1, -1), 6),
            ]))
            
            elements.append(cat_summary_table)
            elements.append(Spacer(1, 0.25*inch))
            elements.append(Paragraph("Perguntas:", styles['Header3']))
            elements.append(Spacer(1, 0.1*inch))

            # Perguntas da categoria
            subcategories_for_category = cat_item.subcategorias_maturity.filter(tipo="PERGUNTA").order_by('pergunta__codigo')
            for subcat_item in subcategories_for_category:
                resposta_obj = next((r for r in formulario.respostas.all() if r.pergunta_id == subcat_item.pergunta.id), None)
                
                # Formatar pergunta
                question_text = f"<b>{subcat_item.pergunta.codigo}:</b> {subcat_item.pergunta.questao}"
                elements.append(Paragraph(question_text, styles['Question']))
                
                # Formatar respostas
                answer_data = [
                    ["Política:", f"{subcat_item.politica:.1f}" if subcat_item.politica is not None else "N/A",
                     f"{resposta_obj.politica if resposta_obj else 'N/A'} (Respondido por: {resposta_obj.usuario.get_full_name() if resposta_obj and resposta_obj.usuario else 'N/A'})"],
                    ["Prática:", f"{subcat_item.pratica:.1f}" if subcat_item.pratica is not None else "N/A",
                     f"{resposta_obj.pratica if resposta_obj else 'N/A'} (Respondido por: {resposta_obj.usuario.get_full_name() if resposta_obj and resposta_obj.usuario else 'N/A'})"]
                ]
                
                answer_table = Table(answer_data, colWidths=[0.8*inch, 0.7*inch, 4.5*inch])
                answer_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), hex_to_color(COLORS['primary']['light'])),
                    ('BACKGROUND', (1, 0), (1, -1), hex_to_color(COLORS['secondary']['light'])),
                    ('BACKGROUND', (2, 0), (2, -1), hex_to_color(COLORS['background']['lighter'])),
                    ('TEXTCOLOR', (0, 0), (-1, -1), hex_to_color(COLORS['text']['dark'])),
                    ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
                    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
                    ('ALIGN', (2, 0), (2, -1), 'LEFT'),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('GRID', (0, 0), (-1, -1), 0.5, hex_to_color(COLORS['secondary']['light'])),
                    ('PADDING', (0, 0), (-1, -1), 5),
                ]))
                
                elements.append(answer_table)
                
                # Informações complementares
                if resposta_obj and resposta_obj.info_complementar:
                    elements.append(Spacer(1, 0.1*inch))
                    elements.append(Paragraph("<b>Informações Complementares:</b>", styles['Question']))
                    elements.append(Paragraph(resposta_obj.info_complementar, styles['Answer']))
                    elements.append(Spacer(1, 0.1*inch))
                
                # Recomendações
                pergunta_recomendacoes = formulario.recomendacoes_formulario.filter(perguntaId=subcat_item.pergunta.codigo)
                if pergunta_recomendacoes.exists():
                    elements.append(Spacer(1, 0.1*inch))
                    elements.append(HRFlowable(width="90%", thickness=0.5, 
                                             color=hex_to_color(COLORS['secondary']['light']), 
                                             spaceAfter=5, hAlign='CENTER'))
                    
                    for rec in pergunta_recomendacoes:
                        # Título da recomendação
                        rec_title = f"<b>Recomendação para {subcat_item.pergunta.codigo} (Prioridade: {rec.get_prioridade_display()})</b>"
                        elements.append(Paragraph(rec_title, styles['RecommendationTitle']))
                        
                        # Metadados
                        meta1 = [
                            Paragraph(f"<b>Categoria:</b> {rec.get_categoria_display()}", styles['RecommendationMeta']),
                            Paragraph(f"<b>Tecnologia:</b> {rec.tecnologia}", styles['RecommendationMeta']),
                            Paragraph(f"<b>NIST:</b> {rec.nist}", styles['RecommendationMeta'])
                        ]
                
                        meta2 = [
                            Paragraph(f"<b>Urgência:</b> {rec.get_urgencia_display()}", styles['RecommendationMeta']),
                            Paragraph(f"<b>Gravidade:</b> {rec.get_gravidade_display()}", styles['RecommendationMeta'])
                        ]
                        
                        meta3 = [
                            Paragraph(f"<b>Prazo:</b> {rec.data_fim.strftime('%d/%m/%Y') if rec.data_fim else 'Não definido'}", styles['RecommendationMeta']),
                            Paragraph(f"<b>Responsável:</b> {rec.responsavel if rec.responsavel else 'N/A'}", styles['RecommendationMeta'])
                        ]
                        
                        meta_table1 = Table([meta1], colWidths=[2*inch, 2*inch, 2*inch])
                        meta_table1.setStyle(TableStyle([
                            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                            ('PADDING', (0, 0), (-1, -1), 0),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                        ]))
                        
                        meta_table2 = Table([meta2], colWidths=[3*inch, 3*inch])
                        meta_table2.setStyle(TableStyle([
                            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                            ('PADDING', (0, 0), (-1, -1), 0),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                        ]))
                        
                        meta_table3 = Table([meta3], colWidths=[3*inch, 3*inch])
                        meta_table3.setStyle(TableStyle([
                            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                            ('PADDING', (0, 0), (-1, -1), 0),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                        ]))
                        
                        elements.append(meta_table1)
                        elements.append(meta_table2)
                        elements.append(meta_table3)
                        
                        # Detalhes
                        elements.append(Paragraph(f"<b>Detalhes:</b> {rec.detalhes}", styles['RecommendationDetail']))
                        
                        # Riscos, Justificativa e Observações
                        if rec.riscos and rec.riscos.strip().lower() not in ["não informado", "nao informado", ""]:
                            elements.append(Paragraph(f"<b>Riscos:</b> {rec.riscos}", styles['RecommendationDetail']))
                        
                        if rec.justificativa and rec.justificativa.strip().lower() not in ["não informado", "nao informado", ""]:
                            elements.append(Paragraph(f"<b>Justificativa:</b> {rec.justificativa}", styles['RecommendationDetail']))
                        
                        if rec.observacoes and rec.observacoes.strip().lower() not in ["nenhuma observação adicional", ""]:
                            elements.append(Paragraph(f"<b>Observações:</b> {rec.observacoes}", styles['RecommendationDetail']))
                        
                        elements.append(Spacer(1, 0.2*inch))
                
                elements.append(Spacer(1, 0.25*inch))
            
            current_category_num += 1
        
        current_section_num += 1
        elements.append(PageBreak())

    # ==============================================
    # RECOMENDAÇÕES GERAIS
    # ==============================================
    elements.append(Paragraph(f"{current_section_num}. Recomendações Gerais", styles['Header1']))
    elements.append(Spacer(1, 0.25*inch))

    general_recomendations = formulario.recomendacoes_formulario.filter(perguntaId="Não informado")
    
    if general_recomendations.exists():
        for rec in general_recomendations:
            # Título da recomendação
            rec_title = f"<b>{rec.nome}</b> (Prioridade: {rec.get_prioridade_display()})"
            elements.append(Paragraph(rec_title, styles['RecommendationTitle']))
            
            # Metadados
            meta1 = [
                Paragraph(f"<b>Categoria:</b> {rec.get_categoria_display()}", styles['RecommendationMeta']),
                Paragraph(f"<b>Tecnologia:</b> {rec.tecnologia}", styles['RecommendationMeta']),
                Paragraph(f"<b>NIST:</b> {rec.nist}", styles['RecommendationMeta'])
            ]
            
            meta2 = [
                Paragraph(f"<b>Urgência:</b> {rec.get_urgencia_display()}", styles['RecommendationMeta']),
                Paragraph(f"<b>Gravidade:</b> {rec.get_gravidade_display()}", styles['RecommendationMeta'])
            ]
            
            meta3 = [
                Paragraph(f"<b>Prazo:</b> {rec.data_fim.strftime('%d/%m/%Y') if rec.data_fim else 'Não definido'}", styles['RecommendationMeta']),
                Paragraph(f"<b>Responsável:</b> {rec.responsavel if rec.responsavel else 'N/A'}", styles['RecommendationMeta'])
            ]
            
            meta_table1 = Table([meta1], colWidths=[2*inch, 2*inch, 2*inch])
            meta_table2 = Table([meta2], colWidths=[3*inch, 3*inch])
            meta_table3 = Table([meta3], colWidths=[3*inch, 3*inch])
            
            elements.append(meta_table1)
            elements.append(meta_table2)
            elements.append(meta_table3)
            
            # Detalhes
            elements.append(Paragraph(f"<b>Detalhes:</b> {rec.detalhes}", styles['RecommendationDetail']))
            
            # Riscos, Justificativa e Observações
            if rec.riscos and rec.riscos.strip().lower() not in ["não informado", "nao informado", ""]:
                elements.append(Paragraph(f"<b>Riscos:</b> {rec.riscos}", styles['RecommendationDetail']))
            
            if rec.justificativa and rec.justificativa.strip().lower() not in ["não informado", "nao informado", ""]:
                elements.append(Paragraph(f"<b>Justificativa:</b> {rec.justificativa}", styles['RecommendationDetail']))
            
            if rec.observacoes and rec.observacoes.strip().lower() not in ["nenhuma observação adicional", ""]:
                elements.append(Paragraph(f"<b>Observações:</b> {rec.observacoes}", styles['RecommendationDetail']))
            
            elements.append(Spacer(1, 0.3*inch))
    else:
        elements.append(Paragraph("Nenhuma recomendação geral registrada.", styles['Answer']))

    # ==============================================
    # OBSERVAÇÕES E PENDÊNCIAS
    # ==============================================
    elements.append(PageBreak())
    elements.append(Paragraph(f"{current_section_num+1}. Observações e Pendências", styles['Header1']))
    elements.append(Spacer(1, 0.25*inch))

    if formulario.observacoes_pendencia and formulario.observacoes_pendencia.strip():
        elements.append(Paragraph(formulario.observacoes_pendencia, styles['Answer']))
    else:
        elements.append(Paragraph("Nenhuma observação ou pendência registrada.", styles['Answer']))

    # ==============================================
    # GERAR PDF
    # ==============================================
    doc.build(elements, onFirstPage=footer, onLaterPages=footer)
    
    pdf_content = buffer.getvalue()
    buffer.close()
    return ContentFile(pdf_content, name=f"relatorio_nist_{formulario.id}.pdf")
